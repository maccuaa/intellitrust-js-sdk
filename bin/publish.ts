#!/usr/bin/env node

import * as execa from "execa";
import * as fs from "fs";

const ADMIN_PATH = "admin-sdk";
const AUTH_PATH = "auth-sdk";

/**
 * Main function.
 */
(async () => {
  const exists = (path: string) => {
    if (!fs.existsSync(ADMIN_PATH)) {
      console.error(ADMIN_PATH, "does not exist. Did you forget to build?");
      process.exit(1);
    }
  };

  const publish = async (path: string) => {
    const subprocess = execa("npm", ["publish", "--public"], { cwd: path });
    subprocess.stdout.pipe(process.stdout);
    subprocess.stderr.pipe(process.stderr);
    subprocess.stdin.pipe(process.stdin);

    await subprocess;
  };

  exists(ADMIN_PATH);
  exists(AUTH_PATH);

  await publish(ADMIN_PATH);
  await publish(AUTH_PATH);
})();
