import { $ } from "bun";
import { build } from "bunup";
import { exports, unused } from "bunup/plugins";
import { getAllSdkTypes, getGeneratorOptions, type SdkType } from "./lib";

/**
 * Generate SDK from OpenAPI specification
 */
const generateSdk = async (sdkType: SdkType): Promise<void> => {
  const startTime = Date.now();
  console.log(`🚀 Starting ${sdkType} SDK generation...`);

  try {
    const { input, output } = getGeneratorOptions(sdkType);

    console.log(`🧹 Cleaning output directory: ${output}`);

    // Clean the output directory
    await $`git -C ${output} clean -fdX`;
    console.log(`✅ Cleanup completed for ${sdkType} SDK`);

    console.log(`⚙️  Generating ${sdkType} SDK from OpenAPI spec: ${input}`);

    const result = await $`bunx -bun openapi-generator-cli generate -i ${input} \
      -g typescript-axios \
      -t templates \
      -o ${output} \
      --global-property=apiDocs=false,modelDocs=false`.quiet();

    if (result.exitCode !== 0) {
      throw new Error(`OpenAPI generation failed with exit code ${result.exitCode}`);
    }

    console.log(`✅ Code generation completed for ${sdkType} SDK`);

    // Run TypeScript type checking
    console.log(`🔍 Running TypeScript type checking for ${sdkType} SDK...`);
    const tscResult = await $`bunx -bun tsc --noEmit --project ${output}/tsconfig.json`.quiet();

    if (tscResult.exitCode !== 0) {
      throw new Error(`TypeScript type checking failed with exit code ${tscResult.exitCode}`);
    }

    console.log(`✅ TypeScript type checking passed for ${sdkType} SDK`);

    console.log(`🔨 Building ${sdkType} SDK with bundler...`);

    // Build the generated SDK
    await build(
      {
        entry: "index.ts",
        outDir: "dist",
        format: "esm",
        target: "node",
        sourcemap: true,
        dts: true,
        clean: false,
        silent: true,
        plugins: [exports(), unused()],
      },
      output,
    );

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ ${sdkType} SDK generation completed successfully in ${duration}s`);
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.error(`❌ Failed to generate ${sdkType} SDK after ${duration}s:`, error);
    throw error;
  }
};

/**
 * Main function
 */
const main = async (): Promise<void> => {
  const totalStartTime = Date.now();
  console.log("🏁 Starting SDK generation process...");

  const sdkTypes = getAllSdkTypes();
  console.log(`📦 Found ${sdkTypes.length} SDK types to generate: ${sdkTypes.join(", ")}`);

  try {
    await Promise.all(sdkTypes.map((sdkType) => generateSdk(sdkType)));

    const totalDuration = ((Date.now() - totalStartTime) / 1000).toFixed(2);
    console.log(`🎉 All ${sdkTypes.length} SDKs generated successfully in ${totalDuration}s`);
  } catch (error) {
    const totalDuration = ((Date.now() - totalStartTime) / 1000).toFixed(2);
    console.error(`💥 SDK generation process failed after ${totalDuration}s:`, error);
    process.exit(1);
  }
};

// Execute main function
await main();
