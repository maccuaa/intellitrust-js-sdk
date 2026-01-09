export type SdkType = "admin" | "auth" | "issuance";

export interface GeneratorOptions {
  input: string;
  output: string;
}

/**
 * SDK configuration - simple mapping of SDK type to paths
 */
const SDK_CONFIG: Record<SdkType, GeneratorOptions> = {
  admin: {
    input: "./openapi/administration.json",
    output: "packages/admin-sdk",
  },
  auth: {
    input: "./openapi/authentication.json",
    output: "packages/auth-sdk",
  },
  issuance: {
    input: "./openapi/issuance.json",
    output: "packages/issuance-sdk",
  },
};

export const getGeneratorOptions = (type: SdkType): GeneratorOptions => SDK_CONFIG[type];

export const getAllSdkTypes = (): SdkType[] => Object.keys(SDK_CONFIG) as SdkType[];

export const getAllSdkPackageDirs = (): string[] => Object.values(SDK_CONFIG).map((config) => config.output);
