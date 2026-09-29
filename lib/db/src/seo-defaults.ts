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
    title: "Long Money Concepts — Abundance Blueprint by La'Toya Ray, CPA",
    description:
      "Long Money Concepts by La'Toya Ray, CPA — home of Abundance Blueprint, a memoir-driven guide to healing the story beneath spending, debt, hustle, and financial exhaustion.",
  },
  {
    path: "/about",
    title: "About La'Toya Ray — CPA & Author | Long Money Concepts",
    description:
      "Meet La'Toya Ray, CPA, founder of Long Money Concepts — financial strategist, real estate investor, and author of Abundance Blueprint: A Journey to Financial Harmony.",
  },
  {
    path: "/book",
    title: "Abundance Blueprint: A Journey to Financial Harmony | Long Money Concepts",
    description:
      "Abundance Blueprint by La'Toya Ray, CPA is a memoir-driven guide to healing the emotional story beneath money, for people who know what to do but still struggle.",
  },
  {
    path: "/library",
    title: "The Long Money Library — Guides & Resources | Long Money Concepts",
    description:
      "Free crisis resources, the Financial Foundations guide (digital and print), workshops, and merch from Long Money Concepts — tools that map back to the HEALS™ framework.",
  },
  {
    path: "/work-with-me",
    title: "Work With Me — HEALS™ Services | Long Money Concepts",
    description:
      "Financial wellness services from Long Money Concepts built on the HEALS™ Method — the Long Money Circle, Financial Wellness Reset, Advisory Membership, and workshops.",
  },
  {
    path: "/financial-wellness-reset",
    title: "The Financial Wellness Reset | Long Money Concepts",
    description:
      "A 12-week, one-on-one guided experience from Long Money Concepts built on the HEALS™ Method — moving you from where you are now into real, structural financial change.",
  },
  {
    path: "/readiness-assessment",
    title: "Readiness Assessment | Long Money Concepts",
    description:
      "A quick check to see where you're starting from — and which Long Money Concepts offering fits next.",
  },
  {
    path: "/contact",
    title: "Contact La'Toya Ray, CPA | Long Money Concepts",
    description:
      "Reach La'Toya Ray, CPA and Long Money Concepts for speaking, bulk book orders, press, and collaboration.",
  },
  {
    path: "/circle",
    title: "The Long Money Circle — Free Community | Long Money Concepts",
    description:
      "Join the Long Money Circle, a free community hosted by La'Toya Ray, CPA, for honest conversations about financial healing and wellness.",
  },
  {
    path: "/blog",
    title: "Blog — Money, Healing & Financial Harmony | Long Money Concepts",
    description:
      "Stories, reflections, and practical notes on money, healing, and building a life of financial harmony from La'Toya Ray, CPA and Long Money Concepts.",
  },
  {
    path: "/privacy",
    title: "Privacy Policy | Long Money Concepts",
    description:
      "How Long Money Concepts and La'Toya Ray, CPA collect, use, and protect your personal information.",
  },
  {
    path: "/terms",
    title: "Terms of Service | Long Money Concepts",
    description:
      "The terms and conditions for using the Long Money Concepts website by La'Toya Ray, CPA.",
  },
];

export const staticPageMetaPaths: string[] = staticPageMetaDefaults.map(
  (entry) => entry.path,
);

export function getPageMetaDefault(path: string): PageMetaDefault | undefined {
  return staticPageMetaDefaults.find((entry) => entry.path === path);
}
