#!/usr/bin/env node

import * as fs from "fs";
import * as dotenv from "dotenv";
import axios from "axios";
import getGeneratorOptions from "./lib";

dotenv.config();

const basePath = process.env.BASE_PATH || "https://entrust.us.trustedauth.com";

const DOC_PATH = `${basePath}/documentation/apiDocs`;
const VERSION_KEY = "npmVersion";

/**
 * Main function.
 */
(async () => {
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
      console.error("Invalid IntelliTrust version found", version);
      process.exit(1);
    }

    return [major, minor, patch].join(".");
  };

  /**
   * Download and save Swagger file.
   * @param file The name of the swagger file.
   */
  const downloadFile = async (type: "auth" | "admin") => {
    const { config: configFile, input: file } = getGeneratorOptions(type);

    const URL = `${DOC_PATH}/${file}`;

    console.log("Downloading", file, "from", URL);

    const response = await axios.get(URL);

    const swagger = response.data;

    console.log("Writing", file);

    fs.writeFileSync(file, JSON.stringify(swagger, null, 2), {
      encoding: "utf-8"
    });

    console.log("Reading", configFile);

    const configStr = fs.readFileSync(configFile, { encoding: "utf-8" });

    const config = JSON.parse(configStr);

    const version = formatVersion(swagger.info.version);

    config[VERSION_KEY] = version;

    console.log("Saving", configFile);

    fs.writeFileSync(configFile, JSON.stringify(config, null, 2), {
      encoding: "utf-8"
    });

    console.log("Saved.");
  };

  await downloadFile("admin");
  await downloadFile("auth");
})();
