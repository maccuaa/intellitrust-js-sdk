import { getAllSdkTypes, getGeneratorOptions, type SdkType } from "./lib";

const BASE_PATH = "https://entrust.us.trustedauth.com";
const DOC_PATH = `${BASE_PATH}/help/developer/openapi`;

interface OpenApiSpec {
  info: {
    version: string;
  };
}

/**
 * Formats a version so that the patch version is properly applied.
 *
 * @example
 * formatVersion("5.5") // returns "5.5.0"
 * formatVersion("5.5.1") // returns "5.5.1"
 *
 * @param version The version read from the OpenAPI spec
 * @returns The properly formatted semantic version
 */
const formatVersion = (version: string): string => {
  const [major, minor, patch = "0"] = version.split(".");

  if (!major || !minor || !/^\d+$/.test(major) || !/^\d+$/.test(minor)) {
    throw new Error(`Invalid version format: ${version}`);
  }

  return [major, minor, patch].join(".");
};

/**
 * Download OpenAPI specification with retry logic
 */
const download = async (url: string): Promise<OpenApiSpec> => {
  console.log(`Downloading from ${url}...`);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const spec = (await response.json()) as OpenApiSpec;

  if (!spec?.info?.version) {
    throw new Error("Invalid OpenAPI spec: missing version information");
  }

  console.log(`✅ Downloaded successfully (${spec.info.version})`);
  return spec;
};

/**
 * Download and save OpenAPI specification file
 */
const downloadFile = async (type: SdkType): Promise<void> => {
  try {
    const { input: specPath, packageJson: packageJsonPath } = getGeneratorOptions(type);

    // Map SDK types to their remote filenames
    const remoteFilenames: Record<SdkType, string> = {
      admin: "administration.json",
      auth: "authentication.json",
      issuance: "issuance.json",
    };

    const url = `${DOC_PATH}/${remoteFilenames[type]}`;

    console.log(`Downloading ${type} SDK specification...`);

    // Download the OpenAPI spec
    const spec = await download(url);

    // Write the spec file
    console.log(`Writing ${remoteFilenames[type]}...`);
    await Bun.write(specPath, JSON.stringify(spec, null, 2));

    const version = formatVersion(spec.info.version);

    // Update the package.json version
    const packageJson = Bun.file(packageJsonPath);
    console.log(`Updating ${packageJson.name}...`);

    const packageJsonData = await packageJson.json();
    packageJsonData.version = version;

    await Bun.write(packageJson, JSON.stringify(packageJsonData, null, 2));

    console.log(`✅ ${type} SDK files updated successfully (v${version})`);
  } catch (error) {
    console.error(`❌ Failed to download ${type} SDK:`, error instanceof Error ? error.message : error);
    throw error;
  }
};

/**
 * Main function - downloads all SDK specifications
 */
console.log("💾 Starting download of all SDK specifications...");

await Promise.all(getAllSdkTypes().map((sdkType) => downloadFile(sdkType)));

console.log("✅ All SDK specifications downloaded successfully!");
