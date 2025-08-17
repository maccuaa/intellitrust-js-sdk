import { getAllSdkTypes, getGeneratorOptions, type SdkType } from "./lib";

const BASE_PATH = "https://entrust.us.trustedauth.com";
const DOC_PATH = `${BASE_PATH}/help/developer/openapi`;
const VERSION_KEY = "npmVersion";
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

interface OpenApiSpec {
  info: {
    version: string;
  };
}

interface Config {
  [key: string]: unknown;
  npmVersion?: string;
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
 * Sleep for specified milliseconds
 */
const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Download OpenAPI specification with retry logic
 */
const downloadWithRetry = async (url: string, retries = MAX_RETRIES): Promise<OpenApiSpec> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${retries}: Downloading from ${url}`);

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
    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed:`, error instanceof Error ? error.message : error);

      if (attempt === retries) {
        throw new Error(`Failed to download after ${retries} attempts: ${error}`);
      }

      if (attempt < retries) {
        console.log(`Retrying in ${RETRY_DELAY}ms...`);
        await sleep(RETRY_DELAY);
      }
    }
  }

  throw new Error("Unexpected error in download retry loop");
};

/**
 * Download and save OpenAPI specification file
 */
const downloadFile = async (type: SdkType): Promise<void> => {
  try {
    const { config: configPath, input: specPath } = getGeneratorOptions(type);

    // Map SDK types to their remote filenames
    const remoteFilenames: Record<SdkType, string> = {
      admin: "administration.json",
      auth: "authentication.json",
      issuance: "issuance.json",
    };

    const url = `${DOC_PATH}/${remoteFilenames[type]}`;

    console.log(`Downloading ${type} SDK specification...`);

    // Download the OpenAPI spec
    const spec = await downloadWithRetry(url);

    // Write the spec file
    console.log(`Writing ${remoteFilenames[type]}...`);
    await Bun.write(specPath, JSON.stringify(spec, null, 2));

    // Update the config file with version
    const configFile = Bun.file(configPath);
    console.log(`Updating ${configFile.name}...`);

    const configText = await configFile.text();
    const config = JSON.parse(configText) as Config;
    const version = formatVersion(spec.info.version);

    config[VERSION_KEY] = version;

    await Bun.write(configFile, JSON.stringify(config, null, 2));

    console.log(`✅ ${type} SDK files updated successfully (v${version})`);
  } catch (error) {
    console.error(`❌ Failed to download ${type} SDK:`, error instanceof Error ? error.message : error);
    throw error;
  }
};

/**
 * Main function - downloads all SDK specifications
 */
try {
  console.log("💾 Starting download of all SDK specifications...");

  const sdkTypes = getAllSdkTypes();

  for (const sdkType of sdkTypes) {
    await downloadFile(sdkType);
  }

  console.log("✅ All SDK specifications downloaded successfully!");
} catch (error) {
  console.error("❌ Download process failed:", error instanceof Error ? error.message : error);
  process.exit(1);
}
