import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { fetchPublicSeo, type PublicPageSeo } from "@/lib/blog-api";

export const SITE_NAME = "Abundance Blueprint";
export const DEFAULT_TITLE = "Abundance Blueprint — La'Toya Ray, CPA";
export const DEFAULT_DESCRIPTION =
  "A memoir-driven guide to healing the story beneath the spending, debt, hustle, and financial exhaustion. By La'Toya Ray, CPA.";

/**
 * Client-side fallbacks so the correct meta renders instantly on first paint,
 * before (or if) the /api/seo request resolves. The server value, once loaded,
 * takes precedence and reflects the client's edits in the admin dashboard.
 */
export const STATIC_PAGE_META: Record<string, PublicPageSeo> = {
  "/": { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION },
  "/about": {
    title: "About La'Toya Ray — CPA & Author | Abundance Blueprint",
    description:
      "Meet La'Toya Ray, CPA, financial strategist, real estate investor, and author of Abundance Blueprint: A Journey to Financial Harmony.",
  },
  "/book": {
    title: "The Book — Abundance Blueprint: A Journey to Financial Harmony",
    description:
      "Abundance Blueprint is a memoir-driven guide to healing the emotional story beneath money, for people who know what to do but still struggle.",
  },
  "/work-with-me": {
    title: "Work With Me — La'Toya Ray, CPA | Abundance Blueprint",
    description:
      "Connect with La'Toya Ray, CPA for speaking, financial strategy, and collaboration. Start a conversation about your financial harmony.",
  },
  "/circle": {
    title: "The Long Money Circle — Free Community | Abundance Blueprint",
    description:
      "A free Facebook community for honest conversations about money, financial healing, and building Financial Harmony — led by La'Toya Ray, CPA.",
  },
  "/blog": {
    title: "Blog — Money, Healing & Financial Harmony | Abundance Blueprint",
    description:
      "Stories, reflections, and practical notes on money, healing, and building a life of financial harmony from La'Toya Ray, CPA.",
  },
  "/privacy": {
    title: "Privacy Policy | Abundance Blueprint",
    description:
      "How Abundance Blueprint and La'Toya Ray, CPA collect, use, and protect your personal information.",
  },
  "/terms": {
    title: "Terms of Service | Abundance Blueprint",
    description:
      "The terms and conditions for using the Abundance Blueprint website by La'Toya Ray, CPA.",
  },
};

type SeoContextValue = { pages: Record<string, PublicPageSeo> };

const SeoContext = createContext<SeoContextValue>({ pages: STATIC_PAGE_META });

export function SeoProvider({ children }: { children: ReactNode }) {
  const [pages, setPages] =
    useState<Record<string, PublicPageSeo>>(STATIC_PAGE_META);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await fetchPublicSeo();
      if (cancelled || !result.ok) return;
      const merged = { ...STATIC_PAGE_META };
      for (const [path, value] of Object.entries(result.data.pages)) {
        merged[path] = {
          title: value.title || merged[path]?.title || DEFAULT_TITLE,
          description:
            value.description ||
            merged[path]?.description ||
            DEFAULT_DESCRIPTION,
        };
      }
      setPages(merged);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return <SeoContext.Provider value={{ pages }}>{children}</SeoContext.Provider>;
}

function upsertNamedMeta(name: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[name="${name}"]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertPropertyMeta(property: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[property="${property}"]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function applyMeta(title: string, description: string, robots: string) {
  document.title = title;
  upsertNamedMeta("description", description);
  upsertNamedMeta("robots", robots);
  upsertPropertyMeta("og:title", title);
  upsertPropertyMeta("og:description", description);
  upsertPropertyMeta("og:type", "website");
  upsertNamedMeta("twitter:card", "summary_large_image");
  upsertNamedMeta("twitter:title", title);
  upsertNamedMeta("twitter:description", description);
}

/**
 * Sets the document title and meta tags for the current page. Resolution order:
 * explicit prop -> SEO context (by path) -> static fallback -> site default.
 * Renders nothing.
 */
export function PageMeta({
  path,
  title,
  description,
  noindex = false,
}: {
  path?: string;
  title?: string;
  description?: string;
  noindex?: boolean;
}) {
  const { pages } = useContext(SeoContext);
  const fromMap = path
    ? pages[path] ?? STATIC_PAGE_META[path]
    : undefined;

  const finalTitle =
    (title && title.trim()) || fromMap?.title || DEFAULT_TITLE;
  const finalDescription =
    (description && description.trim()) ||
    fromMap?.description ||
    DEFAULT_DESCRIPTION;
  const robots = noindex ? "noindex, nofollow" : "index, follow";

  useEffect(() => {
    applyMeta(finalTitle, finalDescription, robots);
  }, [finalTitle, finalDescription, robots]);

  return null;
}
