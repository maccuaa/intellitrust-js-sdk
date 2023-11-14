import { ux } from "@oclif/core";

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
      }
    );

    await subprocess.exited;
  };

  ux.action.start("Building SDKs");

  await Bun.spawn(["bun", "run", "build"]).exited;

  ux.action.stop();

  const otp = await ux.prompt("🔑 Enter OTP", { required: true });

  await publish(ADMIN_PATH, otp);
  await publish(AUTH_PATH, otp);
})();
