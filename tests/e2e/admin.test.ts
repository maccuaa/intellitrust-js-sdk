import { describe, expect, it } from "bun:test";
import { ActivateParmsTypeEnum, type AdminApiAuthentication, API } from "@maccuaa/intellitrust-admin-sdk";
import { API as AuthApi } from "@maccuaa/intellitrust-auth-sdk";

const basePath = process.env.BASE_PATH;

if (!basePath) {
  throw new Error("BASE_PATH not defined.");
}

const credentials: AdminApiAuthentication = {
  applicationId: process.env.ADMIN_APP_ID ?? "",
  sharedSecret: process.env.ADMIN_SECRET ?? "",
};

const apiKey = `${credentials.applicationId},${credentials.sharedSecret}`;

describe("Administration API", () => {
  it("should successfully call IDaaS", async () => {
    const sdk = new API({ basePath, apiKey });

    const listResponse = await sdk.listAuthApiApplicationsUsingGET();

    expect(listResponse.status).toBe(200);
  });

  it("should create a soft token", async () => {
    const sdk = new API({ basePath, apiKey });

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

  it("should create a user with a password provisioned", async () => {
    const sdk = new API({ basePath, apiKey });

    const response = await sdk.createUserUsingPOST({
      userId: `testuser${Date.now()}`,
      firstName: "Test",
      lastName: "User",
      email: "success@simulator.amazonses.com",
    });

    expect(response.status).toBe(200);

    const passwordResponse = await sdk.getUserPasswordUsingGET(response.data.id);

    expect(passwordResponse.status).toBe(200);

    expect(passwordResponse.data.present).toBe(true);

    await sdk.deleteUserUsingDELETE(response.data.id);
  });

  it.only("should create a user with a token and perform TOTP authentication", async () => {
    const sdk = new API({ basePath, apiKey });

    const response = await sdk.createUserUsingPOST({
      userId: `testuser${Date.now()}`,
      firstName: "Test",
      lastName: "User",
      email: "success@simulator.amazonses.com",
    });

    expect(response.status).toBe(200);

    const user = response.data;

    // Create a new Soft Token for the user
    const createTokenResult = await sdk.createTokenUsingPOST(user.id, "GOOGLE_AUTHENTICATOR", {
      activateParms: { type: [ActivateParmsTypeEnum.Offline] },
    });

    expect(createTokenResult.status).toBe(200);

    const token = createTokenResult.data;

    const startResult = await sdk.startActivateTokenUsingPOST(token.id, {
      deliverActivationEmail: false,
      returnQRCode: false,
      type: [ActivateParmsTypeEnum.Offline],
    });

    expect(startResult.status).toBe(200);

    const url = new URL(startResult.data.activationURL);
    const secret = url.searchParams.get("secret");

    const code = await totp(secret);

    const authSdk = new AuthApi({ basePath });

    const authResponse = await authSdk.userChallengeUsingPOST("TOKEN", {
      userId: user.userId,
      applicationId: process.env.AUTH_APP_ID ?? "",
    });

    expect(authResponse.status).toBe(200);

    const authResult = await authSdk.userAuthenticateUsingPOST(
      "TOKEN",
      {
        userId: user.userId,
        applicationId: process.env.AUTH_APP_ID ?? "",
        response: code,
      },
      authResponse.data.token,
    );

    expect(authResult.status).toBe(200);

    expect(authResult.data.authenticationCompleted).toBe(true);

    await sdk.deleteUserUsingDELETE(user.id);
  });
});

/**
 * Generates a TOTP code based on the provided secret.
 * This implementation uses the Web Crypto API available in Bun.
 * Assume SHA1 and a 30-second time step for 6 digits.
 * @param secret - Base32 encoded secret from the QR code URL
 * @returns 6-digit TOTP code as a string
 */
const totp = async (secret: string): Promise<string> => {
  // Decode Base32 secret to bytes
  const keyData = base32Decode(secret);

  // Create ArrayBuffer for crypto.subtle
  const arrayBuffer = new ArrayBuffer(keyData.length);
  const view = new Uint8Array(arrayBuffer);
  view.set(keyData);

  const cryptoKey = await crypto.subtle.importKey("raw", arrayBuffer, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
  const counter = Math.floor(Date.now() / 30000); // 30-second time step
  const counterBuffer = new ArrayBuffer(8);
  new DataView(counterBuffer).setBigUint64(0, BigInt(counter));

  const hmac = await crypto.subtle.sign("HMAC", cryptoKey, counterBuffer);
  const hmacArray = new Uint8Array(hmac);
  const offset = hmacArray[hmacArray.length - 1] & 0xf;

  const code =
    (hmacArray[offset] & 0x7f) * 0x1000000 +
    (hmacArray[offset + 1] & 0xff) * 0x10000 +
    (hmacArray[offset + 2] & 0xff) * 0x100 +
    (hmacArray[offset + 3] & 0xff);

  return (code % 1000000).toString().padStart(6, "0");
};

/**
 * Simple base32 decoder for TOTP secrets
 */
function base32Decode(encoded: string): Uint8Array {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const cleanInput = encoded.toUpperCase().replace(/[^A-Z2-7]/g, "");

  let bits = 0;
  let value = 0;
  const output = new Uint8Array(Math.floor((cleanInput.length * 5) / 8));
  let outputIndex = 0;

  for (let i = 0; i < cleanInput.length; i++) {
    const char = cleanInput[i];
    const charValue = alphabet.indexOf(char);

    if (charValue === -1) continue;

    value = (value << 5) | charValue;
    bits += 5;

    if (bits >= 8) {
      output[outputIndex++] = (value >>> (bits - 8)) & 255;
      bits -= 8;
    }
  }

  return output.slice(0, outputIndex);
}
