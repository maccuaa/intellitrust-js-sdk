import * as AuthSDK from "../auth-sdk/dist/index";
import * as dotenv from "dotenv";

dotenv.config();

const basePath = process.env.BASE_PATH;

const queryParms: AuthSDK.UserAuthenticateQueryParameters = {
  userId: process.env.AUTH_USER_ID,
  applicationId: process.env.AUTH_APP_ID
};

describe("Authentication API", () => {
  it("should successfully call IntelliTrust", async () => {
    const sdk = new AuthSDK.API({
      basePath
    });

    const response = await sdk.userAuthenticatorQueryUsingPOST(queryParms);

    expect(response.status).toBe(200);
  });
});
