/**
 * Seeds default SEO metadata for fixed public routes.
 *
 * - Inserts missing paths.
 * - Refreshes rows that still match a known previous default (so brand/title
 *   upgrades ship without overwriting client customizations).
 *
 * Usage:
 *   DATABASE_URL=... pnpm --filter @workspace/db run seed-seo
 */
import { eq } from "drizzle-orm";
import { closePool, db } from "./index";
import { pageMetaTable } from "./schema";
import { staticPageMetaDefaults } from "./seo-defaults";

/** Prior defaults that should be upgraded in place when still unmodified. */
const previousDefaultsByPath: Record<
  string,
  Array<{ title: string; description: string }>
> = {
  "/": [
    {
      title: "Abundance Blueprint — La'Toya Ray, CPA",
      description:
        "A memoir-driven guide to healing the story beneath the spending, debt, hustle, and financial exhaustion. By La'Toya Ray, CPA.",
    },
  ],
  "/about": [
    {
      title: "About La'Toya Ray — CPA & Author | Abundance Blueprint",
      description:
        "Meet La'Toya Ray, CPA, financial strategist, real estate investor, and author of Abundance Blueprint: A Journey to Financial Harmony.",
    },
  ],
  "/book": [
    {
      title: "The Book — Abundance Blueprint: A Journey to Financial Harmony",
      description:
        "Abundance Blueprint is a memoir-driven guide to healing the emotional story beneath money, for people who know what to do but still struggle.",
    },
  ],
  "/library": [
    {
      title: "The Long Money Library — Guides & Resources | Abundance Blueprint",
      description:
        "Free crisis resources, the Financial Foundations guide (digital and print), workshops, and merch — tools that map back to the HEALS™ framework.",
    },
  ],
  "/work-with-me": [
    {
      title: "Work With Me — HEALS™ Services | Abundance Blueprint",
      description:
        "Financial wellness services built on the HEALS™ Method — the Long Money Circle, Financial Wellness Reset, Advisory Membership, and workshops rooted in Abundance Blueprint.",
    },
  ],
  "/financial-wellness-reset": [
    {
      title: "The Financial Wellness Reset | Abundance Blueprint",
      description:
        "A 12-week, one-on-one guided experience built on the HEALS™ Method — moving you from where you are now into real, structural financial change.",
    },
  ],
  "/readiness-assessment": [
    {
      title: "Readiness Assessment | Abundance Blueprint",
      description:
        "A quick check to see where you're starting from — and which Long Money Concepts offering fits next.",
    },
  ],
  "/contact": [
    {
      title: "Contact — La'Toya Ray, CPA | Abundance Blueprint",
      description:
        "Reach La'Toya Ray, CPA for speaking, bulk book orders, press, and collaboration.",
    },
  ],
  "/circle": [
    {
      title: "The Long Money Circle — Free Community | Abundance Blueprint",
      description:
        "Join the Long Money Circle, a free community hosted by La'Toya Ray, CPA, for honest conversations about financial healing and wellness.",
    },
    {
      title: "The Long Money Circle — Free Community | Abundance Blueprint",
      description:
        "A free Facebook community for honest conversations about money, financial healing, and building Financial Harmony — led by La'Toya Ray, CPA.",
    },
  ],
  "/blog": [
    {
      title: "Blog — Money, Healing & Financial Harmony | Abundance Blueprint",
      description:
        "Stories, reflections, and practical notes on money, healing, and building a life of financial harmony from La'Toya Ray, CPA.",
    },
  ],
  "/privacy": [
    {
      title: "Privacy Policy | Abundance Blueprint",
      description:
        "How Abundance Blueprint and La'Toya Ray, CPA collect, use, and protect your personal information.",
    },
  ],
  "/terms": [
    {
      title: "Terms of Service | Abundance Blueprint",
      description:
        "The terms and conditions for using the Abundance Blueprint website by La'Toya Ray, CPA.",
    },
  ],
};

function matchesPreviousDefault(
  path: string,
  title: string,
  description: string,
): boolean {
  const previous = previousDefaultsByPath[path] ?? [];
  return previous.some(
    (entry) => entry.title === title && entry.description === description,
  );
}

async function seedPageMeta() {
  let inserted = 0;
  let upgraded = 0;
  let leftAlone = 0;

  for (const entry of staticPageMetaDefaults) {
    const existing = await db
      .select()
      .from(pageMetaTable)
      .where(eq(pageMetaTable.path, entry.path))
      .limit(1);

    const row = existing[0];
    if (!row) {
      await db.insert(pageMetaTable).values({
        path: entry.path,
        title: entry.title,
        description: entry.description,
      });
      inserted += 1;
      continue;
    }

    if (matchesPreviousDefault(row.path, row.title, row.description)) {
      await db
        .update(pageMetaTable)
        .set({
          title: entry.title,
          description: entry.description,
          updatedAt: new Date(),
        })
        .where(eq(pageMetaTable.path, entry.path));
      upgraded += 1;
      continue;
    }

    leftAlone += 1;
  }

  console.log(
    `SEO seed complete: ${inserted} inserted, ${upgraded} upgraded from prior defaults, ${leftAlone} left unchanged.`,
  );
  await closePool();
}

seedPageMeta().catch((err) => {
  console.error(err);
  process.exit(1);
});
