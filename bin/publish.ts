import { prompt } from "./lib";

const ADMIN_PATH = "admin-sdk";
const AUTH_PATH = "auth-sdk";

/**
 * Main function.
 */
(async () => {
  const publish = async (path: string, otp: string) => {
    const subprocess = Bun.spawn(
      ["npm", "publish", "--access", "public", "--otp", otp],
      {
        cwd: path,
        stdout: "inherit",
        stderr: "inherit",
      }
    );

    await subprocess.exited;
  };

  const otp = await prompt("🔑 Enter OTP: ");

  console.log("OTP is", otp);

  if (otp) {
    await publish(ADMIN_PATH, otp);
    await publish(AUTH_PATH, otp);
  }
})();
