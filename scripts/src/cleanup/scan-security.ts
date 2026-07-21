import type { Finding } from "./types";
import { getLineNumber, toRelativePath } from "./utils";

const TARGET_BLANK_ANCHOR_PATTERN = /<a\b[^>]*\btarget=(["'])_blank\1[^>]*>/g;
const DANGEROUS_HTML_PATTERN = /\bdangerouslySetInnerHTML\b/g;
const INNER_HTML_PATTERN = /\binnerHTML\s*=/g;
const EVAL_PATTERN = /\beval\s*\(|\bnew Function\s*\(/g;
const JAVASCRIPT_HREF_PATTERN = /href=(["'])javascript:/gi;

export function scanSecurity(filePath: string, content: string): Finding[] {
  const findings: Finding[] = [];
  const relativePath = toRelativePath(filePath);

  for (const match of content.matchAll(TARGET_BLANK_ANCHOR_PATTERN)) {
    if (/\brel=/.test(match[0])) {
      continue;
    }

    findings.push({
      ruleId: "security/target-blank-rel",
      title: "External link missing rel protection",
      category: "security",
      severity: "error",
      filePath: relativePath,
      line: getLineNumber(content, match.index ?? 0),
      message:
        'Links opened with `target="_blank"` should also include `rel="noopener noreferrer"`.',
      suggestion: 'Add `rel="noopener noreferrer"` on the same anchor tag.',
      fixable: true,
    });
  }

  for (const match of content.matchAll(DANGEROUS_HTML_PATTERN)) {
    findings.push({
      ruleId: "security/dangerous-html",
      title: "dangerouslySetInnerHTML usage",
      category: "security",
      severity: "error",
      filePath: relativePath,
      line: getLineNumber(content, match.index ?? 0),
      message: "HTML injection APIs need an explicit trust boundary.",
      suggestion: "Prefer React text/nodes, or sanitize before inject.",
    });
  }

  for (const match of content.matchAll(INNER_HTML_PATTERN)) {
    findings.push({
      ruleId: "security/inner-html",
      title: "Direct innerHTML assignment",
      category: "security",
      severity: "error",
      filePath: relativePath,
      line: getLineNumber(content, match.index ?? 0),
      message: "Direct HTML assignment can become an injection sink.",
      suggestion: "Prefer text rendering or sanitize first.",
    });
  }

  for (const match of content.matchAll(EVAL_PATTERN)) {
    findings.push({
      ruleId: "security/eval-like",
      title: "Eval-like execution",
      category: "security",
      severity: "error",
      filePath: relativePath,
      line: getLineNumber(content, match.index ?? 0),
      message: "Dynamic code execution should not appear in frontend app code.",
      suggestion: "Replace with explicit control flow.",
    });
  }

  for (const match of content.matchAll(JAVASCRIPT_HREF_PATTERN)) {
    findings.push({
      ruleId: "security/javascript-href",
      title: "javascript: href usage",
      category: "security",
      severity: "error",
      filePath: relativePath,
      line: getLineNumber(content, match.index ?? 0),
      message: "javascript: URLs execute in page context and should not be used.",
      suggestion: "Use a button or an event handler instead.",
    });
  }

  return findings;
}
