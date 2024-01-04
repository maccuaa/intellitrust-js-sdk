import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

interface GeneratorOptions {
  input: string;
  output: string;
  config: string;
}

export const getGeneratorOptions = (
  type: "admin" | "auth"
): GeneratorOptions => {
  let input: string = "";
  let output: string = "";
  let config: string = "";

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

  return {
    input,
    output,
    config,
  };
};

export const prompt = async (question: string) => {
  const rl = createInterface({ input, output });

  const response = await rl.question(question);

  rl.close();

  return response.trim();
};
