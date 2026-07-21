import path from "node:path";

import { applySafeFixes } from "./cleanup/apply-safe-fixes";
import { buildReport, printReport, writeReport } from "./cleanup/report";
import { scanCleanCode } from "./cleanup/scan-clean-code";
import { scanReactCss } from "./cleanup/scan-react-css";
import { scanSecurity } from "./cleanup/scan-security";
import type { CleanupOptions, Finding } from "./cleanup/types";
import {
  collectTargetFiles,
  readFileMap,
  repoRoot,
  toRelativePath,
} from "./cleanup/utils";

function parseArgs(argv: string[]): CleanupOptions {
  let targetPath = path.join(
    repoRoot,
    "artifacts/abundance-blueprint/src",
  );
  let reportFile = path.join(repoRoot, "tmp/frontend-cleanup-report.json");
  let applySafeFixesFlag = false;
  let verbose = false;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--") {
      continue;
    }

    if (arg === "--target") {
      targetPath = path.resolve(argv[index + 1] ?? "");
      index += 1;
      continue;
    }

    if (arg === "--report-file") {
      reportFile = path.resolve(argv[index + 1] ?? "");
      index += 1;
      continue;
    }

    if (arg === "--apply-safe-fixes") {
      applySafeFixesFlag = true;
      continue;
    }

    if (arg === "--verbose") {
      verbose = true;
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      console.log(
        "Usage: tsx src/cleanup.ts [--target <path>] [--report-file <path>] [--apply-safe-fixes] [--verbose]",
      );
      process.exit(0);
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return {
    targetPath,
    reportFile,
    applySafeFixes: applySafeFixesFlag,
    verbose,
  };
}

function runScanners(fileMap: Map<string, string>): Finding[] {
  const findings: Finding[] = [];

  for (const [filePath, content] of fileMap.entries()) {
    findings.push(...scanReactCss(filePath, content));
    findings.push(...scanCleanCode(filePath, content));
    findings.push(...scanSecurity(filePath, content));
  }

  return findings;
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const targetFiles = await collectTargetFiles(options.targetPath);
  const fileMap = await readFileMap(targetFiles);

  const appliedFixes = options.applySafeFixes
    ? await applySafeFixes(fileMap)
    : [];
  const findings = runScanners(fileMap);
  const report = buildReport(
    targetFiles.length,
    toRelativePath(options.targetPath),
    findings,
    appliedFixes.map((fix) => ({
      ...fix,
      filePath: toRelativePath(fix.filePath),
    })),
  );

  printReport(report, options.verbose);
  await writeReport(options.reportFile, report);
  console.log(`JSON report written to ${toRelativePath(options.reportFile)}`);
}

main().catch((error) => {
  console.error("Frontend cleanup audit failed.");
  console.error(error);
  process.exit(1);
});
