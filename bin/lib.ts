import { join } from "node:path";

interface GeneratorOptions {
  input: string;
  output: string;
  config: string;
}

export const getGeneratorOptions = (type: "admin" | "auth" | "issuance"): GeneratorOptions => {
  let input = "";
  let output = "";
  let config = "";

  if (type === "admin") {
    input = "administration.json";
    output = "admin-sdk";
    config = "config-admin.json";
  }

  if (type === "auth") {
    input = "authentication.json";
    output = "auth-sdk";
    config = "config-auth.json";
  }

  if (type === "issuance") {
    input = "issuance.json";
    output = "issuance-sdk";
    config = "config-issuance.json";
  }

  return {
    input,
    output,
    config,
  };
};

const README = "README.md";
const ADMIN_EXAMPLE = "admin-example.ts";
const AUTH_EXAMPLE = "auth-example.ts";
const ISSUANCE_EXAMPLE = "issuance-example.ts";

export const generateReadme = async (config: string, output: string, type: string) => {
  const isAdmin = type === "admin";
  const isAuth = type === "auth";

  const sdkType = isAdmin ? "Administration" : isAuth ? "Authentication" : "Issuance";
  const sdkVar = isAdmin ? "AdminSDK" : isAuth ? "AuthSDK" : "IssuanceSDK";
  const examplePath = isAdmin ? ADMIN_EXAMPLE : isAuth ? AUTH_EXAMPLE : ISSUANCE_EXAMPLE;

  const options = await Bun.file(config).text();

  const { npmName, npmVersion } = JSON.parse(options);

  const example = await Bun.file(join("templates", examplePath)).text();

  const readme = renderReadme(npmName, npmVersion, example, sdkType, sdkVar);

  await Bun.write(join(output, README), readme);
};

export const renderReadme = (
  npmName: string,
  npmVersion: string,
  example: string,
  sdkType: string,
  sdkVar: string,
): string => {
  return `## ${npmName}@${npmVersion}

This is a JavaScript client for the Entrust Identity as a Service ${sdkType} API. This module can be used in the following environments:

- Node.js
- Browser

It can be used in both TypeScript and JavaScript projects.

### Installation

\`\`\`bash
npm install ${npmName} --save
\`\`\`

### Usage

**NOTE:** Make sure to replace the configuration values in the examples with the values from your Identity as a Service account!

\`\`\`javascript
import * as ${sdkVar} from "${npmName}";

${example}
\`\`\`

### Help

For more information on how to use the APIs please refer to the Identity as a Service [${sdkType} API](https://entrust.us.trustedauth.com/help/developer/apis/${sdkType.toLowerCase()}/installation) documentation.
`;
};
