import { describe, expect, it } from "bun:test";
import { userAuthenticatorQueryUsingPost } from "@maccuaa/intellitrust-auth-sdk";

const baseUrl = process.env.BASE_PATH;

if (!baseUrl) {
  throw new Error("BASE_PATH not defined.");
}

describe("Authentication API", () => {
  it("should successfully call IDaaS", async () => {
    const response = await userAuthenticatorQueryUsingPost(
      {
        userAuthenticateQueryParameters: {
          userId: process.env.AUTH_USER_ID ?? "",
          applicationId: process.env.AUTH_APP_ID ?? "",
        },
      },
      { baseUrl },
    );

    expect(response.status).toBe(200);
  });
});
