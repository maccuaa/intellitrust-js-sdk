import { join } from "node:path";
import { $ } from "bun";
import { build } from "bunup";
import { exports, unused } from "bunup/plugins";
import { cleanDirectory } from "./clean";
import { getAllSdkTypes, getGeneratorOptions, type SdkType } from "./lib";

/**
 * Generate SDK from OpenAPI specification
 */
const generateSdk = async (sdkType: SdkType): Promise<void> => {
  const startTime = Date.now();
  console.log(`\n🏗️  ${sdkType.toUpperCase()} SDK`);

  try {
    const { input, output } = getGeneratorOptions(sdkType);

    // 1. Clean the output directory (keep only package.json)
    console.log(`   🧹 Cleaning ${output}`);
    await cleanDirectory(output);

    // 2. generate the SDK using oazapfts
    console.log(`   ⚙️  Generating from ${input}`);
    const specPath = join(process.cwd(), input);
    await $`bunx oazapfts ${specPath} index.ts --argumentStyle object`.cwd(output).quiet();

    // 3. Install dependencies for the SDK package (needed for isolated installs)
    console.log(`   📦 Installing dependencies`);
    await $`bun install --cwd ${output}`.quiet();

    // 4. Build the SDK and generate declarations via bunup
    console.log(`   🔨 Building SDK`);

    await build(
      {
        entry: "index.ts",
        outDir: "dist",
        format: "esm",
        target: "node",
        sourcemap: true,
        dts: {
          entry: ["index.ts"],
          inferTypes: true,
        },
        clean: false,
        plugins: [exports(), unused()],
      },
      output,
    );

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`   ✅ Done in ${duration}s`);
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.error(`   ❌ Failed after ${duration}s:`, error);
    throw error;
  }
};

/**
 * Main function
 */
const main = async (): Promise<void> => {
  const totalStartTime = Date.now();
  const sdkTypes = getAllSdkTypes();

  console.log("╔═══════════════════════════════════════╗");
  console.log("║      🔨 Generating TypeScript SDKs    ║");
  console.log("╚═══════════════════════════════════════╝");
  console.log(`\nGenerating ${sdkTypes.length} SDK packages: ${sdkTypes.join(", ")}\n`);

  try {
    // Generate all SDKs
    for (const sdkType of sdkTypes) {
      await generateSdk(sdkType);
    }

    const totalDuration = ((Date.now() - totalStartTime) / 1000).toFixed(2);
    console.log(`\n✅ Generation complete in ${totalDuration}s`);
  } catch (error) {
    const totalDuration = ((Date.now() - totalStartTime) / 1000).toFixed(2);
    console.error(`\n❌ Generation failed after ${totalDuration}s`);
    console.error(`\n📋 Error Summary:`);
    console.error(`   ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
};

// Execute main function
await main();
