import { $ } from "bun";

const ADMIN_PATH = "admin-sdk";
const AUTH_PATH = "auth-sdk";
const ISSUANCE_PATH = "issuance-sdk";

/**
 * Main function.
 */
(async () => {
  const publish = async (path: string) => {
    await $`bun publish --provenance --access public ${process.env.CI ? "" : '--dry-run'}`.cwd(path);
  };

  await publish(ADMIN_PATH);
  await publish(AUTH_PATH);
  await publish(ISSUANCE_PATH);
})();
