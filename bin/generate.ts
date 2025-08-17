import { $ } from "bun";
import { generateReadme, getAllSdkTypes, getGeneratorOptions, type SdkType } from "./lib";

/**
 * Generate SDK from OpenAPI specification
 */
const generateSdk = async (sdkType: SdkType): Promise<void> => {
  try {
    const { input, output, config } = getGeneratorOptions(sdkType);

    console.log(`Generating ${sdkType} SDK...`);

    const result =
      await $`bunx openapi-generator-cli generate -i ${input} -g typescript-axios -t templates -o ${output} -c ${config}`.quiet();

    if (result.exitCode !== 0) {
      throw new Error(`Generation failed with exit code ${result.exitCode}`);
    }

    console.log("Post processing files...");
    await generateReadme(output, sdkType);
    console.log("✅ SDK generation completed successfully");
  } catch (error) {
    console.error(`❌ Failed to generate ${sdkType} SDK:`, error);
    process.exit(1);
  }
};

/**
 * Main function
 */
try {
  console.log("Starting SDK generation...");

  const sdkTypes = getAllSdkTypes();

  for (const sdkType of sdkTypes) {
    await generateSdk(sdkType);
  }

  console.log("All SDKs generated successfully");
} catch (error) {
  console.error("❌ Failed to generate SDKs:", error);
  process.exit(1);
}
