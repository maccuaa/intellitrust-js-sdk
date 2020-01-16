export interface GeneratorOptions {
  input: string;
  output: string;
  config: string;
}

export const getGeneratorOptions = (
  type: "admin" | "auth"
): GeneratorOptions => {
  let input: string,
    output: string,
    config: string = "";

  if (type === "admin") {
    input = "ADMINISTRATION.json";
    output = "admin-sdk";
    config = "config-admin.json";
  }

  if (type === "auth") {
    input = "AUTHENTICATION.json";
    output = "auth-sdk";
    config = "config-auth.json";
  }

  return {
    input,
    output,
    config
  };
};

export default getGeneratorOptions;
