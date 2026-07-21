import type { Finding } from "./types";
import { getLineNumber, toRelativePath } from "./utils";

const IMPORT_SOURCE_PATTERN = /^import[\s\S]*?from\s+["']([^"']+)["'];?$/gm;
const TODO_PATTERN = /\b(?:TODO|FIXME)\b/g;
const CONSOLE_LOG_PATTERN = /console\.log\(/g;
/** Comeau least privilege: prefer narrow handlers over passing setState. */
const SET_STATE_PROP_PATTERN = /\bset[A-Z]\w*\s*=\s*\{/g;

export function scanCleanCode(filePath: string, content: string): Finding[] {
  const findings: Finding[] = [];
  const relativePath = toRelativePath(filePath);

  const importSources = new Map<string, number[]>();
  for (const match of content.matchAll(IMPORT_SOURCE_PATTERN)) {
    const source = match[1];
    const locations = importSources.get(source) ?? [];
    locations.push(getLineNumber(content, match.index ?? 0));
    importSources.set(source, locations);
  }

  for (const [source, lines] of importSources.entries()) {
    if (lines.length < 2) {
      continue;
    }

    findings.push({
      ruleId: "clean-code/duplicate-import-source",
      title: "Duplicate import source",
      category: "clean-code",
      severity: "warning",
      filePath: relativePath,
      line: lines[1],
      message: `The module "${source}" is imported ${lines.length} times in this file.`,
      suggestion: "Merge repeated imports from the same module.",
    });
  }

  for (const match of content.matchAll(TODO_PATTERN)) {
    findings.push({
      ruleId: "clean-code/todo-marker",
      title: "TODO or FIXME marker",
      category: "clean-code",
      severity: "info",
      filePath: relativePath,
      line: getLineNumber(content, match.index ?? 0),
      message: "Unresolved TODO/FIXME marker in app code.",
      suggestion: "Track it as a task or remove it if the work is done.",
    });
  }

  for (const match of content.matchAll(CONSOLE_LOG_PATTERN)) {
    findings.push({
      ruleId: "clean-code/console-log",
      title: "console.log usage",
      category: "clean-code",
      severity: "warning",
      filePath: relativePath,
      line: getLineNumber(content, match.index ?? 0),
      message: "Leftover console.log in production-facing frontend code.",
      suggestion: "Remove it or guard it for local debugging only.",
    });
  }

  for (const match of content.matchAll(SET_STATE_PROP_PATTERN)) {
    findings.push({
      ruleId: "clean-code/setstate-prop",
      title: "State setter passed as a prop",
      category: "clean-code",
      severity: "info",
      filePath: relativePath,
      line: getLineNumber(content, match.index ?? 0),
      message:
        "Passing a raw `setState` setter grants broad privilege to child components (Comeau: principle of least privilege).",
      suggestion:
        "Pass a narrow handler (e.g. `onAddItem`) that only performs the intended update.",
    });
  }

  return findings;
}
