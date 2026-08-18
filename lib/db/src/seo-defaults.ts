/**
 * Canonical list of fixed public routes that get editable SEO metadata,
 * with sensible defaults. Shared by the seed script and the API server so
 * that unedited pages still return meaningful titles/descriptions.
 */
export type PageMetaDefault = {
  path: string;
  title: string;
  description: string;
};

export const staticPageMetaDefaults: PageMetaDefault[] = [
  {
    path: "/",
    title: "Abundance Blueprint — La'Toya Ray, CPA",
    description:
      "A memoir-driven guide to healing the story beneath the spending, debt, hustle, and financial exhaustion. By La'Toya Ray, CPA.",
  },
  {
    path: "/about",
    title: "About La'Toya Ray — CPA & Author | Abundance Blueprint",
    description:
      "Meet La'Toya Ray, CPA, financial strategist, real estate investor, and author of Abundance Blueprint: A Journey to Financial Harmony.",
  },
  {
    path: "/book",
    title: "The Book — Abundance Blueprint: A Journey to Financial Harmony",
    description:
      "Abundance Blueprint is a memoir-driven guide to healing the emotional story beneath money, for people who know what to do but still struggle.",
  },
  {
    path: "/work-with-me",
    title: "Work With Me — La'Toya Ray, CPA | Abundance Blueprint",
    description:
      "Connect with La'Toya Ray, CPA for speaking, financial strategy, and collaboration. Start a conversation about your financial harmony.",
  },
  {
    path: "/circle",
    title: "The Long Money Circle — Free Community | Abundance Blueprint",
    description:
      "Join the Long Money Circle, a free community hosted by La'Toya Ray, CPA, for honest conversations about financial healing and wellness.",
  },
  {
    path: "/blog",
    title: "Blog — Money, Healing & Financial Harmony | Abundance Blueprint",
    description:
      "Stories, reflections, and practical notes on money, healing, and building a life of financial harmony from La'Toya Ray, CPA.",
  },
  {
    path: "/privacy",
    title: "Privacy Policy | Abundance Blueprint",
    description:
      "How Abundance Blueprint and La'Toya Ray, CPA collect, use, and protect your personal information.",
  },
  {
    path: "/terms",
    title: "Terms of Service | Abundance Blueprint",
    description:
      "The terms and conditions for using the Abundance Blueprint website by La'Toya Ray, CPA.",
  },
];

export const staticPageMetaPaths: string[] = staticPageMetaDefaults.map(
  (entry) => entry.path,
);

export function getPageMetaDefault(path: string): PageMetaDefault | undefined {
  return staticPageMetaDefaults.find((entry) => entry.path === path);
}
