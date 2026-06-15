import { getAllSdkTypes, getGeneratorOptions, type SdkType } from "./lib";

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
  console.log(`\n📥 ${type.toUpperCase()} SDK`);

  try {
    const { input: specPath, output: packageDir } = getGeneratorOptions(type);

    // Map SDK types to their remote filenames
    const remoteURLs: Record<SdkType, string> = {
      admin: "https://docs.trustedauth.com/openapi/administration.json",
      auth: "https://docs.trustedauth.com/openapi/authentication.json",
      issuance: "http://entrust.us.trustedauth.com/api-docs/api-web-issuance.json",
    };

    const url = remoteURLs[type];

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

    return version;
  } catch (error) {
    console.error(`   ❌ Failed: `, error instanceof Error ? error.message : error);
    throw error;
  }
};

/**
 * Main function - downloads all SDK specifications
 */
const main = async (): Promise<void> => {
  const sdkTypes = getAllSdkTypes();

  try {
    for (const sdkType of sdkTypes) {
      await downloadFile(sdkType);
    }

    console.log(`\n✅ All downloads complete`);
  } catch (_error) {
    console.error(`\n❌ Download failed after`);
    process.exit(1);
  }
};

await main();
