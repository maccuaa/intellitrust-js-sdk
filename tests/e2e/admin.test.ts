import { describe, expect, it } from "bun:test";
import { type AdminApiAuthentication, API } from "@maccuaa/intellitrust-admin-sdk";

const basePath = process.env.BASE_PATH;

if (!basePath) {
  throw new Error("BASE_PATH not defined.");
}

const credentials: AdminApiAuthentication = {
  applicationId: process.env.ADMIN_APP_ID ?? "",
  sharedSecret: process.env.ADMIN_SECRET ?? "",
};

describe("Administration API", () => {
  it("should successfully call IDaaS", async () => {
    const sdk = new API({ basePath });

    const authResponse = await sdk.authenticateAdminApiUsingPOST(credentials);

    expect(authResponse.status).toBe(200);

    const { authToken } = authResponse.data;

    sdk.setApiKey(authToken ?? "");

    const listResponse = await sdk.listAuthApiApplicationsUsingGET();

    expect(listResponse.status).toBe(200);
  });

  it("should successfully use a long-lived token", async () => {
    const sdk = new API({ basePath });

    sdk.setApiKey(`${credentials.applicationId},${credentials.sharedSecret}`);

    const listResponse = await sdk.usersPagedUsingPOST({});

    expect(listResponse.status).toBe(200);
  });

  it("should create a soft token", async () => {
    const sdk = new API({ basePath });

    const authResponse = await sdk.authenticateAdminApiUsingPOST(credentials);

    const { authToken } = authResponse.data;

    sdk.setApiKey(authToken ?? "");

    // Get the user
    const getUserResponse = await sdk.userByUseridUsingPOST({
      userId: "homer",
    });

    const user = getUserResponse.data;

    if (!user || !user.id) {
      throw new Error("User not found or user ID is missing.");
    }

    // Create a new Soft Token for the user
    const createTokenResult = await sdk.createTokenUsingPOST(user.id, "ENTRUST_SOFT_TOKEN");

    const token = createTokenResult.data;

    if (!token || !token.id) {
      throw new Error("Token creation failed or token ID is missing.");
    }

    await sdk.deleteTokenUsingDELETE(token.id);
  });
});
