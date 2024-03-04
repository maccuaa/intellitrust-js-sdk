import { getGeneratorOptions } from "./lib";
import { join } from "node:path";

const GENERATOR = "typescript-axios";
const TEMPLATES = "templates";
const AUTH = "auth";
const ADMIN = "admin";
const README = "README.md";
const ADMIN_EXAMPLE = "admin-example.ts";
const AUTH_EXAMPLE = "auth-example.ts";

const generateReadme = async (config: string, output: string, type: string) => {
  const isAdmin = type === "admin";

  const sdkType = isAdmin ? "Administration" : "Authentication";
  const sdkVar = isAdmin ? "AdminSDK" : "AuthSDK";
  const examplePath = isAdmin ? ADMIN_EXAMPLE : AUTH_EXAMPLE;

  const options = await Bun.file(config).text();

  const { npmName, npmVersion } = JSON.parse(options);

  const example = await Bun.file(join(TEMPLATES, examplePath)).text();

  const readme = renderReadme(npmName, npmVersion, example, sdkType, sdkVar);

  await Bun.write(join(output, README), readme);
};

/**
 * Main function.
 */
(async () => {
  const args = process.argv.slice(2);

  if (args.length !== 1) {
    console.error(
      "Too many arguments provided. Expected 1, received",
      args.length
    );
    process.exit(1);
  }

  const sdkType = args.pop();

  if (sdkType !== "auth" && sdkType !== "admin") {
    console.error(
      `Invalid type provided. Exected '${ADMIN}' or '${AUTH}', received`,
      sdkType
    );
    process.exit(1);
  }

  const { input, output, config } = getGeneratorOptions(sdkType);

  console.log(`Generating ${sdkType} SDK...`);

  const subprocess = Bun.spawn(
    [
      "bunx",
      "openapi-generator-cli",
      "generate",
      "-i",
      input,
      "-g",
      GENERATOR,
      "-t",
      TEMPLATES,
      "-o",
      output,
      "-c",
      config,
    ],
    {
      cwd: process.cwd(),
      shell: true,
      stdout: "inherit",
      stderr: "inherit",
    }
  );

  await subprocess.exited;

  console.log("Post processing files...");

  await generateReadme(config, output, sdkType);

  console.log("Generated README");
})();

const renderReadme = (
  npmName: string,
  npmVersion: string,
  example: string,
  sdkType: string,
  sdkVar: string
): string => {
  return `## ${npmName}@${npmVersion}

This is a JavaScript client for the Entrust Identity as a Service ${sdkType} API. This module can be used in the following environments:

- Node.js
- Webpack
- Browserify

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

For more information on how to use the APIs please refer to the Identity as a Service [${sdkType} API](https://entrust.us.trustedauth.com/documentation/apiDocs/${sdkType.toLowerCase()}.html) documentation.
`;
};
