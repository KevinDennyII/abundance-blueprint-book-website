import path from "node:path";

import type { Finding } from "./types";
import { getLineNumber, toRelativePath } from "./utils";

const INLINE_STYLE_PATTERN = /style=\{\{/g;
const HARDCODED_HEX_PATTERN = /#[0-9a-fA-F]{6}\b/g;
/** Visual-only reordering — DOM/keyboard/SR order stays source order (Comeau Ordering). */
const VISUAL_ORDER_CLASS_PATTERN =
  /\b(?:flex-row-reverse|flex-col-reverse|flex-wrap-reverse|order-(?:first|last|\d+))\b/g;
const INDEX_KEY_PATTERN = /\bkey=\{(?:i|index|idx)\}/g;
const MOTION_LAYOUT_PROP_PATTERN =
  /<motion\.[A-Za-z]+[^>]*\blayout(?:\{?=["']?(?:true|position|size)?["']?\}?)?/g;

/**
 * Comeau-inspired checks that matter for this Tailwind + token-driven site.
 * Skips vendor UI (caller already excludes components/ui).
 */
export function scanReactCss(filePath: string, content: string): Finding[] {
  const findings: Finding[] = [];
  const relativePath = toRelativePath(filePath);
  const extension = path.extname(filePath);
  const lineCount = content.split("\n").length;
  const isPage = relativePath.includes("/pages/");

  // Layout ownership: oversized app modules are hard to reason about.
  // Pages are allowed to be larger than shared components.
  const warnAt = isPage ? 320 : 250;
  const errorAt = isPage ? 450 : 400;

  if (extension === ".tsx" && lineCount > warnAt) {
    findings.push({
      ruleId: "react-css/oversized-component-file",
      title: "Large component file",
      category: "react-css",
      severity: lineCount > errorAt ? "error" : "warning",
      filePath: relativePath,
      line: 1,
      message: `This ${isPage ? "page" : "component"} is ${lineCount} lines, which blurs layout/section ownership.`,
      suggestion:
        "Extract a section component (hero, quote, CTA) so spacing and motion stay colocated with one job.",
    });
  }

  for (const match of content.matchAll(INLINE_STYLE_PATTERN)) {
    findings.push({
      ruleId: "react-css/inline-style",
      title: "Inline style usage",
      category: "react-css",
      severity: "info",
      filePath: relativePath,
      line: getLineNumber(content, match.index ?? 0),
      message:
        "Inline styles are fine for Framer Motion/measured values, but reusable look-and-feel should live in tokens or utilities.",
      suggestion:
        "Prefer theme tokens (text-primary, bg-card) for colors/spacing; keep inline styles for dynamic transform/opacity only.",
    });
  }

  // Comeau Ordering: reverse/order utilities only flip cosmetics, not a11y traversal.
  const visualOrderLines = new Set<number>();
  for (const match of content.matchAll(VISUAL_ORDER_CLASS_PATTERN)) {
    const line = getLineNumber(content, match.index ?? 0);
    if (visualOrderLines.has(line)) {
      continue;
    }
    visualOrderLines.add(line);

    findings.push({
      ruleId: "react-css/visual-order-mismatch",
      title: "Visual order may diverge from DOM order",
      category: "react-css",
      severity: "warning",
      filePath: relativePath,
      line,
      message: `Found visual-order utility (\`${match[0]}\`) — this changes visual order only; keyboard and screen-reader order still follow the DOM.`,
      suggestion:
        "Prefer matching DOM order to the reading order (or use Grid for intentional reordering). Confirm tab/SR flow still matches what sighted users see.",
    });
  }

  // Comeau Keys: index keys are fragile when lists reorder/filter.
  for (const match of content.matchAll(INDEX_KEY_PATTERN)) {
    findings.push({
      ruleId: "react-css/array-index-key",
      title: "Array index used as React key",
      category: "react-css",
      severity: "warning",
      filePath: relativePath,
      line: getLineNumber(content, match.index ?? 0),
      message:
        "Index keys can remount the wrong nodes when list order/content changes.",
      suggestion:
        "Prefer a stable id from the data (slug, href, letter, title). Use intentional key remounts only when you mean to reset state/animation.",
    });
  }

  // Comeau Framer Motion layout: layout transforms can distort nested text.
  if (
    content.includes("framer-motion") ||
    content.includes('from "framer-motion"') ||
    content.includes("from 'framer-motion'")
  ) {
    for (const match of content.matchAll(MOTION_LAYOUT_PROP_PATTERN)) {
      findings.push({
        ruleId: "react-css/motion-layout-prop",
        title: "Framer Motion layout animation",
        category: "react-css",
        severity: "info",
        filePath: relativePath,
        line: getLineNumber(content, match.index ?? 0),
        message:
          "`layout` animates via transforms and can distort nested text/children unless you nest compensating motion nodes and share transition settings.",
        suggestion:
          "Shrinkwrap text, nest motion children to cancel distortion, and copy `transition` onto children (transitions are not inherited).",
      });
    }

    if (
      !content.includes("useReducedMotion") &&
      /<(motion\.|AnimatePresence)/.test(content)
    ) {
      findings.push({
        ruleId: "react-css/reduced-motion",
        title: "Motion without reduced-motion guard",
        category: "react-css",
        severity: "info",
        filePath: relativePath,
        line: 1,
        message:
          "This file animates with Framer Motion but does not reference `useReducedMotion`.",
        suggestion:
          "Respect `prefers-reduced-motion` via Framer’s `useReducedMotion` (or CSS) so vestibular-sensitive users can opt out.",
      });
    }
  }

  // One-off hex in app TSX fights the CSS-variable theme in index.css.
  if (extension === ".tsx") {
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      if (line.trimStart().startsWith("//") || line.trimStart().startsWith("*")) {
        continue;
      }
      if (line.includes("http") || line.includes("import ")) {
        continue;
      }
      if (!HARDCODED_HEX_PATTERN.test(line)) {
        HARDCODED_HEX_PATTERN.lastIndex = 0;
        continue;
      }
      HARDCODED_HEX_PATTERN.lastIndex = 0;

      findings.push({
        ruleId: "react-css/hardcoded-hex",
        title: "Hardcoded hex color in app code",
        category: "react-css",
        severity: "warning",
        filePath: relativePath,
        line: i + 1,
        message:
          "Hardcoded colors bypass the site’s CSS variables and make theming harder to keep consistent.",
        suggestion:
          "Use Tailwind theme tokens (primary, secondary, accent, muted) defined in index.css.",
      });
    }
  }

  return findings;
}
