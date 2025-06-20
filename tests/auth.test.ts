import { describe, expect, it } from "bun:test";
import { API, type UserAuthenticateQueryParameters } from "../auth-sdk";

const basePath = process.env.BASE_PATH;

if (!basePath) {
  throw new Error("BASE_PATH not defined.");
}

const queryParms: UserAuthenticateQueryParameters = {
  userId: process.env.AUTH_USER_ID ?? "",
  applicationId: process.env.AUTH_APP_ID ?? "",
};

describe("Authentication API", () => {
  it("should successfully call IDaaS", async () => {
    const sdk = new API({ basePath });

    const response = await sdk.userAuthenticatorQueryUsingPOST(queryParms);

    expect(response.status).toBe(200);
  });
});
