#!/usr/bin/env node

import * as execa from "execa";

import { CliUx } from "@oclif/core";

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

  CliUx.ux.action.start("Building SDKs");

  await execa("npm", ["run", "build"]);

  CliUx.ux.action.stop();

  const otp = await CliUx.ux.prompt("🔑 Enter OTP", { required: true });

  await publish(ADMIN_PATH, otp);
  await publish(AUTH_PATH, otp);
})();
