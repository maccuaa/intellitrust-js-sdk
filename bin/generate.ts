import { $ } from "bun";
import { generateReadme, getGeneratorOptions } from "./lib";

const AUTH = "auth";
const ADMIN = "admin";
const ISSUANCE = "issuance";

/**
 * Main function.
 */
(async () => {
  const args = process.argv.slice(2);

  if (args.length !== 1) {
    console.error(
      "Too many arguments provided. Expected 1, received",
      args.length
    );
    process.exit(1);
  }

  const sdkType = args.pop();

  if (sdkType !== "auth" && sdkType !== "admin" && sdkType !== "issuance") {
    console.error(
      `Invalid type provided. Expected '${ADMIN}' or '${AUTH}' or '${ISSUANCE}, received`,
      sdkType
    );
    process.exit(1);
  }

  const { input, output, config } = getGeneratorOptions(sdkType);

  console.log(`Generating ${sdkType} SDK...`);

  await $`bunx openapi-generator-cli generate -i ${input} -g typescript-axios -t templates -o ${output} -c ${config}`;

  console.log("Post processing files...");

  await generateReadme(output, sdkType);

  console.log("Updated README");
})();
