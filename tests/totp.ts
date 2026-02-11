/**
 * Generates a TOTP code based on the provided secret.
 * This implementation uses the Web Crypto API available in Bun.
 * Assume SHA1 and a 30-second time step for 6 digits.
 * @param secret - Base32 encoded secret from the QR code URL
 * @returns 6-digit TOTP code as a string
 */
export const totp = async (secret: string): Promise<string> => {
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
