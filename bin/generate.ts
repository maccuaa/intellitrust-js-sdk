import { $ } from "bun";
import { getAllSdkTypes, getGeneratorOptions, type SdkType } from "./lib";

/**
 * Generate SDK from OpenAPI specification
 */
const generateSdk = async (sdkType: SdkType): Promise<void> => {
  try {
    const { input, output } = getGeneratorOptions(sdkType);

    console.log(`Cleaning ${output}...`);

    // Clean the output directory except node_modules
    await $`git -C ${output} clean -fdX -e node_modules`;

    console.log(`Generating ${sdkType} SDK...`);

    const result = await $`bunx -bun openapi-generator-cli generate -i ${input} \
      -g typescript-axios \
      -t templates \
      -o ${output} \
      --global-property=apiDocs=false,modelDocs=false`.quiet();

    if (result.exitCode !== 0) {
      throw new Error(`Generation failed with exit code ${result.exitCode}`);
    }

    console.log("✅ SDK generation completed successfully");
  } catch (error) {
    console.error(`❌ Failed to generate ${sdkType} SDK:`, error);
    throw error;
  }
};

/**
 * Main function
 */
console.log("Starting SDK generation...");

const sdkTypes = getAllSdkTypes();

await Promise.all(sdkTypes.map((sdkType) => generateSdk(sdkType)));

console.log("All SDKs generated successfully");
