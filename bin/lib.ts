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
