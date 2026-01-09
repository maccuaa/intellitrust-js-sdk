import { $ } from "bun";
import { publint } from "publint";
import { formatMessage } from "publint/utils";
import { getAllSdkPackageDirs } from "./lib";

/**
 * Run validation tools on all SDK packages
 */
const main = async (): Promise<void> => {
  const startTime = Date.now();
  const packageDirs = getAllSdkPackageDirs();

  console.log("🔍 Validating SDK Packages\n");

  try {
    // Run publint validation
    console.log("📋 Validating package.json...");

    for (const dir of packageDirs) {
      const pkgName = dir.split("/").pop();

      const { messages, pkg } = await publint({ pkgDir: dir });

      if (messages.length > 0) {
        console.error(`   ❌ ${pkgName}`);
        for (const msg of messages) {
          console.error(`      ${msg.type}: ${formatMessage(msg, pkg)}`);
        }
        throw new Error(`Package configuration issues found in ${pkgName}`);
      }
      console.log(`   ✅ ${pkgName}`);
    }
    console.log("");

    // Run attw validation
    console.log("📦 Validating type exports...");
    for (const dir of packageDirs) {
      const pkgName = dir.split("/").pop();
      try {
        await $`attw --pack ${dir} --profile esm-only --ignore-rules no-resolution`.quiet();
        console.log(`   ✅ ${pkgName}`);
      } catch {
        console.error(`   ❌ ${pkgName}`);
        throw new Error(`Type validation failed for ${pkgName}`);
      }
    }
    console.log("");

    const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ Validation passed in ${totalDuration}s`);
    console.log(`\n✔️  All ${packageDirs.length} packages validated successfully\n`);
  } catch (error) {
    const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.error(`\n❌ Validation failed after ${totalDuration}s`);
    console.error(`\nError: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(1);
  }
};

await main();
