import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

export const repoRoot = path.resolve(currentDir, "../../..");

export function toRelativePath(filePath: string): string {
  return path.relative(repoRoot, filePath).split(path.sep).join("/");
}

export function getLineNumber(content: string, index: number): number {
  return content.slice(0, index).split("\n").length;
}

export function isVendorUiPath(filePath: string): boolean {
  return filePath.split(path.sep).includes("ui");
}

export async function collectTargetFiles(targetPath: string): Promise<string[]> {
  const entries = await fs.readdir(targetPath, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(targetPath, entry.name);

      if (entry.isDirectory()) {
        if (
          entry.name === "node_modules" ||
          entry.name === "dist" ||
          entry.name === "ui"
        ) {
          return [];
        }

        return collectTargetFiles(entryPath);
      }

      if (!/\.(css|ts|tsx)$/.test(entry.name)) {
        return [];
      }

      return [entryPath];
    }),
  );

  return files.flat().sort();
}

export async function readFileMap(
  paths: string[],
): Promise<Map<string, string>> {
  const contents = await Promise.all(
    paths.map(
      async (filePath) =>
        [filePath, await fs.readFile(filePath, "utf8")] as const,
    ),
  );

  return new Map(contents);
}

export async function ensureParentDirectory(filePath: string): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}
