import * as AuthSDK from "../auth-sdk/dist/index";
import * as dotenv from "dotenv";

import { describe, expect, it } from "vitest";

dotenv.config();

const basePath = process.env.BASE_PATH;

if (!basePath) {
  throw new Error("BASE_PATH not defined.");
}

const queryParms: AuthSDK.UserAuthenticateQueryParameters = {
  userId: process.env.AUTH_USER_ID,
  applicationId: process.env.AUTH_APP_ID,
};

describe("Authentication API", () => {
  it("should successfully call IDaaS", async () => {
    const sdk = new AuthSDK.API({ basePath });

    const response = await sdk.userAuthenticatorQueryUsingPOST(queryParms);

    expect(response.status).toBe(200);
  });
});
