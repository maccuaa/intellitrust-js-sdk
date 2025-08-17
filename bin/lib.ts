import { join } from "node:path";

export type SdkType = "admin" | "auth" | "issuance";

export interface GeneratorOptions {
  input: string;
  output: string;
  config: string;
}

const SDK_CONFIG: Record<SdkType, GeneratorOptions> = {
  admin: {
    input: "specs/administration.json",
    output: "packages/admin-sdk",
    config: "specs/config-admin.json",
  },
  auth: {
    input: "specs/authentication.json",
    output: "packages/auth-sdk",
    config: "specs/config-auth.json",
  },
  issuance: {
    input: "specs/issuance.json",
    output: "packages/issuance-sdk",
    config: "specs/config-issuance.json",
  },
};

export const getGeneratorOptions = (type: SdkType): GeneratorOptions => {
  return SDK_CONFIG[type];
};

export const isValidSdkType = (type: string): type is SdkType => {
  return type in SDK_CONFIG;
};

export const getAllSdkTypes = (): SdkType[] => {
  return Object.keys(SDK_CONFIG) as SdkType[];
};

const EXAMPLE_FILES: Record<SdkType, string> = {
  admin: "admin-example.ts",
  auth: "auth-example.ts",
  issuance: "issuance-example.ts",
};

export const generateReadme = async (output: string, type: SdkType): Promise<void> => {
  try {
    const examplePath = EXAMPLE_FILES[type];
    const example = await Bun.file(join("templates", examplePath)).text();
    const readmeFile = join(output, "README.md");
    const readme = await Bun.file(readmeFile).text();
    const newReadme = readme.replace("EXAMPLE-REPLACE-ME", example.trim());
    await Bun.write(readmeFile, newReadme);
  } catch (error) {
    console.error(`Failed to generate README for ${type}:`, error);
    throw error;
  }
};
