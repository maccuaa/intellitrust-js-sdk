import * as AdminSDK from "../admin-sdk";
import * as dotenv from "dotenv";

dotenv.config();

const basePath = process.env.BASE_PATH;

const credentials: AdminSDK.AdminApiAuthentication = {
  applicationId: process.env.ADMIN_APP_ID,
  sharedSecret: process.env.ADMIN_SECRET
};

describe("Administration API", () => {
  it("should successfully call IntelliTrust", async () => {
    const sdk = new AdminSDK.API({
      basePath
    });

    const authResponse = await sdk.authenticateAdminApiUsingPOST(credentials);

    expect(authResponse.status).toBe(200);

    const { authToken } = authResponse.data;

    sdk.setApiKey(authToken);

    const listResponse = await sdk.listAuthApiApplicationsUsingGET();

    expect(listResponse.status).toBe(200);
  });
});
