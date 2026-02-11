import { describe, expect, it } from "bun:test";
import {
  createTokenUsingPost,
  createUserUsingPost,
  deleteTokenUsingDelete,
  deleteUserUsingDelete,
  listAuthApiApplicationsUsingGet,
  startActivateTokenUsingPost,
  userByUseridUsingPost,
} from "@maccuaa/intellitrust-admin-sdk";
import { userAuthenticateUsingPost, userChallengeUsingPost } from "@maccuaa/intellitrust-auth-sdk";
import { totp } from "./totp";

const baseUrl = process.env.BASE_PATH;

if (!baseUrl) {
  throw new Error("BASE_PATH not defined.");
}

const applicationId = process.env.ADMIN_APP_ID ?? "";
const sharedSecret = process.env.ADMIN_SECRET ?? "";

const authHeaders = {
  Authorization: `${applicationId},${sharedSecret}`,
};

describe("Administration API", () => {
  it("should successfully call IDaaS", async () => {
    const listResponse = await listAuthApiApplicationsUsingGet({ baseUrl, headers: authHeaders });

    expect(listResponse.status).toBe(200);
  });

  it("should create a soft token", async () => {
    // Get the user
    const getUserResponse = await userByUseridUsingPost(
      { userGetParms: { userId: "bart" } },
      { baseUrl, headers: authHeaders },
    );

    if (getUserResponse.status !== 200) {
      throw new Error("Failed to get user");
    }

    const user = getUserResponse.data;

    if (!user.id) {
      throw new Error("User not found or user ID is missing.");
    }

    // Create a new Soft Token for the user
    const createTokenResult = await createTokenUsingPost(
      { userid: user.id, $type: "ENTRUST_SOFT_TOKEN" },
      { baseUrl, headers: authHeaders },
    );

    if (createTokenResult.status !== 200) {
      throw new Error("Token creation failed");
    }

    const token = createTokenResult.data;

    if (!token.id) {
      throw new Error("Token ID is missing.");
    }

    await deleteTokenUsingDelete({ tokenid: token.id }, { baseUrl, headers: authHeaders });
  });

  it("should create a user with a token and perform TOTP authentication", async () => {
    const response = await createUserUsingPost(
      {
        userParms: {
          userId: `testuser-${Date.now()}`,
          firstName: "Test",
          lastName: "User",
          email: "success@simulator.amazonses.com",
        },
      },
      { baseUrl, headers: authHeaders },
    );

    expect(response.status).toBe(200);

    if (response.status !== 200) {
      throw new Error("User creation failed");
    }

    const user = response.data;

    if (!user.id) {
      throw new Error("User ID is missing.");
    }

    // Create a new Soft Token for the user
    const createTokenResult = await createTokenUsingPost(
      { userid: user.id, $type: "GOOGLE_AUTHENTICATOR", tokenCreateParms: { activateParms: { type: ["OFFLINE"] } } },
      { baseUrl, headers: authHeaders },
    );

    expect(createTokenResult.status).toBe(200);

    if (createTokenResult.status !== 200) {
      throw new Error("Token creation failed");
    }

    const token = createTokenResult.data;

    if (!token.id) {
      throw new Error("Token ID is missing.");
    }

    const startResult = await startActivateTokenUsingPost(
      {
        tokenid: token.id,
        activateParms: {
          deliverActivationEmail: false,
          returnQRCode: false,
          type: ["OFFLINE"],
        },
      },
      { baseUrl, headers: authHeaders },
    );

    expect(startResult.status).toBe(200);

    if (startResult.status !== 200) {
      throw new Error("Token activation start failed");
    }

    if (!startResult.data.activationURL) {
      throw new Error("Activation URL is missing.");
    }

    const url = new URL(startResult.data.activationURL);
    const secret = url.searchParams.get("secret");

    if (!secret) {
      throw new Error("Secret is missing from activation URL.");
    }

    const code = await totp(secret);

    const authAppId = process.env.AUTH_APP_ID ?? "";

    const authResponse = await userChallengeUsingPost(
      {
        authenticator: "TOKEN",
        userChallengeParameters: {
          userId: user.userId,
          applicationId: authAppId,
        },
      },
      { baseUrl },
    );

    expect(authResponse.status).toBe(200);

    if (authResponse.status !== 200) {
      throw new Error("User challenge failed");
    }

    if (!authResponse.data.token) {
      throw new Error("Auth token is missing.");
    }

    const authResult = await userAuthenticateUsingPost(
      {
        authenticator: "TOKEN",
        authorization: authResponse.data.token,
        userAuthenticateParameters: {
          userId: user.userId,
          applicationId: authAppId,
          response: code,
        },
      },
      { baseUrl },
    );

    expect(authResult.status).toBe(200);

    if (authResult.status !== 200) {
      throw new Error("User authentication failed");
    }

    expect(authResult.data.authenticationCompleted).toBe(true);

    await deleteUserUsingDelete({ id: user.id }, { baseUrl, headers: authHeaders });
  });
});
