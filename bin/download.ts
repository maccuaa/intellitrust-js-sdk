import { readFile, writeFile } from "fs/promises";

import axios from "axios";
import { config } from "dotenv";
import getGeneratorOptions from "./lib";

config();

const basePath = "https://entrust.us.trustedauth.com";

const DOC_PATH = `${basePath}/documentation/apiDocs`;
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
const downloadFile = async (type: "auth" | "admin") => {
  const { config: configFile, input: file } = getGeneratorOptions(type);

  const URL = `${DOC_PATH}/${file}`;

  console.log("Downloading", file, "from", URL);

  const response = await axios.get(URL, { responseType: "json" });

  console.log("Download Status:", response.status);

  const swagger = response.data as Swagger;

  if (!swagger?.info?.version) {
    console.error(
      "Version not found in Swagger file.",
      JSON.stringify(swagger, null, 2)
    );
    console.error(
      "Response headers:",
      JSON.stringify(response.headers, null, 2)
    );
    process.exit(1);
  }

  console.log("Writing", file);

  await writeFile(file, JSON.stringify(swagger, null, 2), {
    encoding: "utf-8",
  });

  console.log("Reading", configFile);

  const configStr = await readFile(configFile, { encoding: "utf-8" });

  const config = JSON.parse(configStr);

  const version = formatVersion(swagger.info.version);

  config[VERSION_KEY] = version;

  console.log("Saving", configFile);

  await writeFile(configFile, JSON.stringify(config, null, 2), {
    encoding: "utf-8",
  });

  console.log("Saved.");
};

/**
 * Main function.
 */
(async () => {
  await downloadFile("admin");
  await downloadFile("auth");
})();
