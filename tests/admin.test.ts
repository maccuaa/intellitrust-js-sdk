import * as AdminSDK from "../admin-sdk";

import { describe, expect, it } from "bun:test";

const basePath = process.env.BASE_PATH;

if (!basePath) {
  throw new Error("BASE_PATH not defined.");
}

const credentials: AdminSDK.AdminApiAuthentication = {
  applicationId: process.env.ADMIN_APP_ID ?? "",
  sharedSecret: process.env.ADMIN_SECRET ?? "",
};

describe("Administration API", () => {
  it("should successfully call IDaaS", async () => {
    const sdk = new AdminSDK.API({ basePath });

    const authResponse = await sdk.authenticateAdminApiUsingPOST(credentials);

    expect(authResponse.status).toBe(200);

    const { authToken } = authResponse.data;

    sdk.setApiKey(authToken);

    const listResponse = await sdk.listAuthApiApplicationsUsingGET();

    expect(listResponse.status).toBe(200);
  });

  it("should create a soft token", async () => {
    const sdk = new AdminSDK.API({ basePath });

    const authResponse = await sdk.authenticateAdminApiUsingPOST(credentials);

    const { authToken } = authResponse.data;

    sdk.setApiKey(authToken);

    // Get the user
    const getUserResponse = await sdk.userByUseridUsingPOST({
      userId: "homer",
    });

    const user = getUserResponse.data;

    // Create a new Soft Token for the user
    const createTokenResult = await sdk.createTokenUsingPOST(user.id, "ENTRUST_SOFT_TOKEN", {
      activateParms: null,
    });

    const token = createTokenResult.data;

    await sdk.deleteTokenUsingDELETE(token.id);
  });
});
