import { join } from "node:path";
import { $ } from "bun";

/**
 * Clean a directory by removing all contents except package.json, tsconfig.json, and README.md
 * Uses Bun's native APIs and built-in shell commands for cross-platform compatibility
 */
export const cleanDirectory = async (dirPath: string): Promise<void> => {
  try {
    // Use Bun's Glob API to find all entries in the directory
    const glob = new Bun.Glob("*");
    const entries = await Array.fromAsync(
      glob.scan({
        cwd: dirPath,
        absolute: false,
        onlyFiles: false,
      }),
    );

    const filesToKeep = new Set(["package.json", "tsconfig.json", "README.md"]);

    // Delete everything except package.json, tsconfig.json, and README.md using Bun Shell's built-in rm
    for (const entry of entries) {
      if (filesToKeep.has(entry)) {
        continue;
      }

      const fullPath = join(dirPath, entry);

      // Use Bun Shell's built-in rm command (cross-platform)
      await $`rm -rf ${fullPath}`.quiet();
    }
  } catch (error) {
    console.error(`Failed to clean directory ${dirPath}:`, error);
    throw error;
  }
};
