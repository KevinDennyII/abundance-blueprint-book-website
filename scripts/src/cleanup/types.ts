export type FindingSeverity = "info" | "warning" | "error";
export type FindingCategory = "react-css" | "clean-code" | "security";
export type FixId = "add-rel-noopener-noreferrer";

export interface StandardReference {
  title: string;
  url?: string;
  summary: string;
}

export interface Finding {
  ruleId: string;
  title: string;
  category: FindingCategory;
  severity: FindingSeverity;
  filePath: string;
  line: number;
  message: string;
  suggestion?: string;
  fixable?: boolean;
}

export interface AppliedFix {
  fixId: FixId;
  filePath: string;
  line: number;
  description: string;
}

export interface CleanupSummary {
  totalFiles: number;
  totalFindings: number;
  bySeverity: Record<FindingSeverity, number>;
  byCategory: Record<FindingCategory, number>;
  fixableFindings: number;
  appliedFixes: number;
}

export interface CleanupReport {
  generatedAt: string;
  targetPath: string;
  standards: StandardReference[];
  findings: Finding[];
  appliedFixes: AppliedFix[];
  summary: CleanupSummary;
}

export interface CleanupOptions {
  targetPath: string;
  reportFile: string;
  applySafeFixes: boolean;
  verbose: boolean;
}
