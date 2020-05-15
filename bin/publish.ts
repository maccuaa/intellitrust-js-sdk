#!/usr/bin/env node

import * as execa from "execa";
import cli from "cli-ux";

const ADMIN_PATH = "admin-sdk";
const AUTH_PATH = "auth-sdk";

/**
 * Main function.
 */
(async () => {
  const publish = async (path: string, otp: string) => {
    const subprocess = execa(
      "npm",
      ["publish", "--access", "public", "--otp", otp],
      {
        cwd: path,
      }
    );

    subprocess.stdout.pipe(process.stdout);
    subprocess.stderr.pipe(process.stderr);
    subprocess.stdin.pipe(process.stdin);

    await subprocess;
  };

  await execa("npm", ["run", "build"]);

  const otp = await cli.prompt("🔑 Enter OTP", { required: true });

  await publish(ADMIN_PATH, otp);
  await publish(AUTH_PATH, otp);
})();
