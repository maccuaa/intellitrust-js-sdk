#!/usr/bin/env node

import * as fs from "fs";
import axios from "axios";

const BASE_PATH = "https://entrust.us.trustedauth.com/documentation/apiDocs";

const ADMIN_FILE = "ADMINISTRATION.json";
const AUTH_FILE = "AUTHENTICATION.json";

/**
 * Main function.
 */
(async () => {
  const downloadFile = async (file: string) => {
    const URL = `${BASE_PATH}/${file}`;

    console.log("Downloading", file);

    const response = await axios.get(URL);

    const swagger = response.data;

    console.log("Writing", file);

    fs.writeFileSync(file, JSON.stringify(swagger, null, 2), {
      encoding: "UTF-8"
    });

    console.log(file, "updated.");
  };

  await downloadFile(ADMIN_FILE);
  await downloadFile(AUTH_FILE);
})();
