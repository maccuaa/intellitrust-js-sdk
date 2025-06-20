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

const ADMIN_EXAMPLE = "admin-example.ts";
const AUTH_EXAMPLE = "auth-example.ts";
const ISSUANCE_EXAMPLE = "issuance-example.ts";

export const generateReadme = async (output: string, type: string) => {
  const isAdmin = type === "admin";
  const isAuth = type === "auth";

  const examplePath = isAdmin ? ADMIN_EXAMPLE : isAuth ? AUTH_EXAMPLE : ISSUANCE_EXAMPLE;

  const example = await Bun.file(join("templates", examplePath)).text();

  const readmeFile = join(output, "README.md");

  const readme = await Bun.file(readmeFile).text();

  const newReadme = readme.replace("EXAMPLE-REPLACE-ME", example);

  await Bun.write(readmeFile, newReadme);
};
