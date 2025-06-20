import { getGeneratorOptions } from "./lib";

const basePath = "https://entrust.us.trustedauth.com";

const DOC_PATH = `${basePath}/help/developer/openapi`;
const VERSION_KEY = "npmVersion";

interface Swagger {
  info: {
    version: string;
  };
}

/**
 * Formats a version so that the patch version is properly applied.
 *
 * 5.5 -> 5.5.0
 * 5.5.1 -> 5.5.1
 *
 * @param version The version read from the Swagger file.
 * @returns The properly formatted version.
 */
const formatVersion = (version: string) => {
  const [major, minor, patch = "0"] = version.split(".");

  if (!major || !minor) {
    console.error("Invalid IDaaS version found", version);
    process.exit(1);
  }

  return [major, minor, patch].join(".");
};

/**
 * Download and save Swagger file.
 */
const downloadFile = async (type: "auth" | "admin" | "issuance") => {
  const { config: genConfig, input } = getGeneratorOptions(type);

  const configFile = Bun.file(genConfig);
  const file = Bun.file(input);

  const url = `${DOC_PATH}/${file.name}`;

  console.log("Downloading", file.name, "from", url);

  const response = await fetch(url);

  console.log("Download Status:", response.status);

  // const swagger = response.data as Swagger;
  const swagger = (await response.json()) as Swagger;

  if (!swagger?.info?.version) {
    console.error("Version not found in Swagger file.", swagger);
    // console.error("Request headers:", JSON.stringify(response.request))
    console.error("Response headers:", JSON.stringify(response.headers, null, 2));
    process.exit(1);
  }

  console.log("Writing", file.name);

  await Bun.write(file, JSON.stringify(swagger, null, 2));

  console.log("Reading", configFile.name);

  const configStr = await configFile.text();

  const config = JSON.parse(configStr);

  const version = formatVersion(swagger.info.version);

  config[VERSION_KEY] = version;

  console.log("Saving", configFile.name);

  await Bun.write(configFile, JSON.stringify(config, null, 2));

  console.log("Saved.");
};

/**
 * Main function.
 */
(async () => {
  await downloadFile("admin");
  await downloadFile("auth");
  await downloadFile("issuance");
})();
