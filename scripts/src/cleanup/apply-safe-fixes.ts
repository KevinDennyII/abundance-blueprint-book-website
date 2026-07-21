import fs from "node:fs/promises";

import type { AppliedFix } from "./types";
import { getLineNumber } from "./utils";

const TARGET_BLANK_ANCHOR_PATTERN = /<a\b[^>]*\btarget=(["'])_blank\1[^>]*>/g;

export async function applySafeFixes(
  fileMap: Map<string, string>,
): Promise<AppliedFix[]> {
  const appliedFixes: AppliedFix[] = [];

  for (const [filePath, originalContent] of fileMap.entries()) {
    let nextContent = originalContent;
    const fileFixes: AppliedFix[] = [];

    nextContent = nextContent.replace(
      TARGET_BLANK_ANCHOR_PATTERN,
      (match, _quote, offset) => {
        if (/\brel=/.test(match)) {
          return match;
        }

        fileFixes.push({
          fixId: "add-rel-noopener-noreferrer",
          filePath,
          line: getLineNumber(originalContent, offset),
          description:
            'Added `rel="noopener noreferrer"` to a `target="_blank"` anchor.',
        });

        return match.replace(/>$/, ' rel="noopener noreferrer">');
      },
    );

    if (fileFixes.length === 0) {
      continue;
    }

    await fs.writeFile(filePath, nextContent, "utf8");
    fileMap.set(filePath, nextContent);
    appliedFixes.push(...fileFixes);
  }

  return appliedFixes;
}
