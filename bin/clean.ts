import { $ } from "bun";
import { getAllSdkTypes, getGeneratorOptions } from "./lib";

const sdkTypes = getAllSdkTypes();

for (const sdkType of sdkTypes) {
  const { output } = getGeneratorOptions(sdkType);
  console.log(`Cleaning ${output}`);
  await $`rm -rf ${output}`;
}
