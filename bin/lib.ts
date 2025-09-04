export type SdkType = "admin" | "auth" | "issuance";

const BASE_DIR: Record<SdkType, string> = {
  admin: "packages/admin-sdk",
  auth: "packages/auth-sdk",
  issuance: "packages/issuance-sdk",
};
interface GeneratorOptions {
  output: string;
  input: string;
  packageJson: string;
}

const makeOptions = (dir: string): GeneratorOptions => ({
  output: dir,
  packageJson: `${dir}/package.json`,
  input: `${dir}/openapi.json`,
});

const SDK_CONFIG: Record<SdkType, GeneratorOptions> = Object.fromEntries(
  (Object.keys(BASE_DIR) as SdkType[]).map((sdk) => [sdk, makeOptions(BASE_DIR[sdk])]),
) as Record<SdkType, GeneratorOptions>;

export const getGeneratorOptions = (type: SdkType): GeneratorOptions => {
  return SDK_CONFIG[type];
};

export const getAllSdkTypes = (): SdkType[] => {
  return Object.keys(SDK_CONFIG) as SdkType[];
};
