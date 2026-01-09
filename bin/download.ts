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
 * Download OpenAPI specification from a given URL
 */
const download = async (url: string): Promise<OpenApiSpec> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const spec = (await response.json()) as OpenApiSpec;

  if (!spec?.info?.version) {
    throw new Error("Invalid OpenAPI spec: missing version information");
  }

  return spec;
};

/**
 * Download and save OpenAPI specification file
 */
const downloadFile = async (type: SdkType): Promise<string> => {
  const startTime = Date.now();
  console.log(`\n📥 ${type.toUpperCase()} SDK`);

  try {
    const { input: specPath, output: packageDir } = getGeneratorOptions(type);

    // Map SDK types to their remote filenames
    const remoteFilenames: Record<SdkType, string> = {
      admin: "administration.json",
      auth: "authentication.json",
      issuance: "issuance.json",
    };

    const url = `${DOC_PATH}/${remoteFilenames[type]}`;

    // Download the OpenAPI spec
    console.log(`   Fetching ${url}`);
    const spec = await download(url);
    const version = formatVersion(spec.info.version);

    // Write the spec file
    console.log(`   Writing OpenAPI spec → ${specPath}`);
    await Bun.write(specPath, JSON.stringify(spec, null, 2));

    // Update the package.json version
    const packageJsonPath = `${packageDir}/package.json`;
    const packageJson = Bun.file(packageJsonPath);
    const packageJsonData = await packageJson.json();
    packageJsonData.version = version;

    console.log(`   Updating package version → v${version}`);
    await Bun.write(packageJson, JSON.stringify(packageJsonData, null, 2));

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`   ✅ Done in ${duration}s`);

    return version;
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.error(`   ❌ Failed after ${duration}s:`, error instanceof Error ? error.message : error);
    throw error;
  }
};

/**
 * Main function - downloads all SDK specifications
 */
const main = async (): Promise<void> => {
  const totalStartTime = Date.now();
  const sdkTypes = getAllSdkTypes();

  console.log("╔═══════════════════════════════════════╗");
  console.log("║   📥 Downloading SDK Specifications   ║");
  console.log("╚═══════════════════════════════════════╝");
  console.log(`\nDownloading ${sdkTypes.length} SDK specifications from Entrust IDaaS...`);

  try {
    for (const sdkType of sdkTypes) {
      await downloadFile(sdkType);
    }

    const totalDuration = ((Date.now() - totalStartTime) / 1000).toFixed(2);
    console.log(`\n✅ All downloads complete ${totalDuration}s`);
  } catch (_error) {
    const totalDuration = ((Date.now() - totalStartTime) / 1000).toFixed(2);
    console.error(`\n❌ Download failed after ${totalDuration}s`);
    process.exit(1);
  }
};

await main();
