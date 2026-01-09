import { describe, expect, it } from "bun:test";
import { authenticateAdminApiUsingPost, listAdminApiApplicationsUsingGet } from "@maccuaa/intellitrust-issuance-sdk";

const baseUrl = process.env.BASE_PATH;

if (!baseUrl) {
  throw new Error("BASE_PATH not defined.");
}

const applicationId = process.env.ADMIN_APP_ID ?? "";
const sharedSecret = process.env.ADMIN_SECRET ?? "";

describe("Issuance API", () => {
  it("should successfully call IDaaS", async () => {
    const authResponse = await authenticateAdminApiUsingPost(
      { adminApiAuthentication: { applicationId, sharedSecret } },
      { baseUrl },
    );

    expect(authResponse.status).toBe(200);

    if (authResponse.status !== 200) {
      throw new Error("Authentication failed");
    }

    const authToken = authResponse.data.authToken;

    if (!authToken) {
      throw new Error("Auth token is missing.");
    }

    const listResponse = await listAdminApiApplicationsUsingGet({
      baseUrl,
      headers: { Authorization: authToken },
    });

    expect(listResponse.status).toBe(200);
  });
});
