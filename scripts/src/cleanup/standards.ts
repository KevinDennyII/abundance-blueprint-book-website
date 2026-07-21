import type { StandardReference } from "./types";

/**
 * Lean standards for Abundance Blueprint — a Tailwind marketing site.
 *
 * Sourced from the user's Notion notes:
 * - Joy of React index + Happy Practices / Framer Motion leaves
 * - CSS for JS Devs → Flexbox → Ordering
 */
export const STANDARDS: StandardReference[] = [
  {
    title: "Josh Comeau — The Joy Of React",
    url: "https://separated-day-526.notion.site/The-Joy-Of-React-d234359051a44f2ca721bcb4c9ec5de5",
    summary:
      "Layout ownership, stable keys, derive instead of duplicating state, least-privilege component APIs, and careful Framer Motion layout usage.",
  },
  {
    title: "Josh Comeau — Ordering (CSS for JS Devs / Flexbox)",
    url: "https://separated-day-526.notion.site/Ordering-3a0175a31ea280e491dbec0695d0e075",
    summary:
      "flex-*-reverse / CSS order change visual order only — keyboard and screen readers still follow DOM order.",
  },
  {
    title: "Clean code (marketing-site slice)",
    summary:
      "Flag leftover console.log, TODO/FIXME markers, duplicate imports, and raw setState props.",
  },
  {
    title: "Frontend security (link + injection)",
    summary:
      "Require rel on target=_blank anchors; flag dangerouslySetInnerHTML, innerHTML, eval-like APIs, and javascript: hrefs.",
  },
];

/** Explicitly omitted — noise or not automatable for this marketing site: */
export const OMITTED_RULES = [
  "react-css/long-classname — Tailwind marketing pages routinely use long utility strings",
  "react-css/long-classname-template — same as above",
  "clean-code/high-state-density — this site is mostly presentational pages",
  "Scanning components/ui/** — shadcn primitives; not product code",
  "security/browser-storage — unused on this site; add back if storage appears",
  "Deriving-state / single-source-of-truth deep analysis — needs human judgment, not regex",
  "Compound components / slots / polymorphism — not used in this site’s API surface",
] as const;
