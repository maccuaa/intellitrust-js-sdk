import { describe, expect, it } from "bun:test";
import { type AdminApiAuthentication, API } from "../issuance-sdk";

const basePath = process.env.BASE_PATH;

if (!basePath) {
  throw new Error("BASE_PATH not defined.");
}

const credentials: AdminApiAuthentication = {
  applicationId: process.env.ADMIN_APP_ID ?? "",
  sharedSecret: process.env.ADMIN_SECRET ?? "",
};

describe("Issuance API", () => {
  it("should successfully call IIDaaS", async () => {
    const sdk = new API({ basePath });

    const authResponse = await sdk.authenticateAdminApiUsingPOST(credentials);

    expect(authResponse.status).toBe(200);

    const { authToken } = authResponse.data;

    sdk.setApiKey(authToken);

    const listResponse = await sdk.listAdminApiApplicationsUsingGET();

    expect(listResponse.status).toBe(200);
  });
});
