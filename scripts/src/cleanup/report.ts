import fs from "node:fs/promises";

import { OMITTED_RULES, STANDARDS } from "./standards";
import type {
  AppliedFix,
  CleanupReport,
  CleanupSummary,
  Finding,
  FindingCategory,
  FindingSeverity,
} from "./types";
import { ensureParentDirectory } from "./utils";

const severityOrder: Record<FindingSeverity, number> = {
  error: 0,
  warning: 1,
  info: 2,
};

function buildSummary(
  totalFiles: number,
  findings: Finding[],
  appliedFixes: AppliedFix[],
): CleanupSummary {
  const bySeverity: Record<FindingSeverity, number> = {
    error: 0,
    warning: 0,
    info: 0,
  };

  const byCategory: Record<FindingCategory, number> = {
    "react-css": 0,
    "clean-code": 0,
    security: 0,
  };

  for (const finding of findings) {
    bySeverity[finding.severity] += 1;
    byCategory[finding.category] += 1;
  }

  return {
    totalFiles,
    totalFindings: findings.length,
    bySeverity,
    byCategory,
    fixableFindings: findings.filter((finding) => finding.fixable).length,
    appliedFixes: appliedFixes.length,
  };
}

export function buildReport(
  totalFiles: number,
  targetPath: string,
  findings: Finding[],
  appliedFixes: AppliedFix[],
): CleanupReport {
  const sortedFindings = [...findings].sort((left, right) => {
    const severityDiff =
      severityOrder[left.severity] - severityOrder[right.severity];
    if (severityDiff !== 0) {
      return severityDiff;
    }

    const fileDiff = left.filePath.localeCompare(right.filePath);
    if (fileDiff !== 0) {
      return fileDiff;
    }

    return left.line - right.line;
  });

  return {
    generatedAt: new Date().toISOString(),
    targetPath,
    standards: STANDARDS,
    findings: sortedFindings,
    appliedFixes,
    summary: buildSummary(totalFiles, sortedFindings, appliedFixes),
  };
}

export async function writeReport(
  reportFile: string,
  report: CleanupReport,
): Promise<void> {
  await ensureParentDirectory(reportFile);
  await fs.writeFile(reportFile, `${JSON.stringify(report, null, 2)}\n`, "utf8");
}

export function printReport(report: CleanupReport, verbose: boolean): void {
  const { summary } = report;

  console.log("Abundance Blueprint frontend cleanup");
  console.log(`Target: ${report.targetPath}`);
  console.log(`Files scanned: ${summary.totalFiles} (skips components/ui)`);
  console.log(
    `Findings: ${summary.totalFindings} (errors: ${summary.bySeverity.error}, warnings: ${summary.bySeverity.warning}, info: ${summary.bySeverity.info})`,
  );
  console.log(
    `Categories: react/css ${summary.byCategory["react-css"]}, clean-code ${summary.byCategory["clean-code"]}, security ${summary.byCategory.security}`,
  );
  console.log(`Applied safe fixes: ${summary.appliedFixes}`);

  if (verbose) {
    console.log("\nStandards:");
    for (const standard of STANDARDS) {
      console.log(`- ${standard.title}: ${standard.summary}`);
    }
    console.log("\nOmitted (noise for this site):");
    for (const rule of OMITTED_RULES) {
      console.log(`- ${rule}`);
    }
    console.log("");
  }

  for (const finding of report.findings) {
    console.log(
      `[${finding.severity}] ${finding.filePath}:${finding.line} ${finding.ruleId} - ${finding.message}`,
    );
  }
}
