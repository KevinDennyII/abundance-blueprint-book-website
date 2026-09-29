import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { fetchPublicSeo, type PublicPageSeo } from "@/lib/blog-api";
import { INSTAGRAM_URL } from "@/lib/social";

/** Canonical production origin — used for absolute URLs in meta, OG, and JSON-LD. */
export const SITE_URL = "https://www.longmoneyconcepts.com";
export const SITE_NAME = "Long Money Concepts";
export const BOOK_TITLE = "Abundance Blueprint";
export const AUTHOR_NAME = "La'Toya Ray, CPA";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/opengraph.jpg`;

export const DEFAULT_TITLE =
  "Long Money Concepts — Abundance Blueprint by La'Toya Ray, CPA";
export const DEFAULT_DESCRIPTION =
  "Long Money Concepts by La'Toya Ray, CPA — home of Abundance Blueprint, a memoir-driven guide to healing the story beneath spending, debt, hustle, and financial exhaustion.";

/**
 * Client-side fallbacks so the correct meta renders instantly on first paint,
 * before (or if) the /api/seo request resolves. The server value, once loaded,
 * takes precedence and reflects the client's edits in the admin dashboard.
 */
export const STATIC_PAGE_META: Record<string, PublicPageSeo> = {
  "/": { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION },
  "/about": {
    title: "About La'Toya Ray — CPA & Author | Long Money Concepts",
    description:
      "Meet La'Toya Ray, CPA, founder of Long Money Concepts — financial strategist, real estate investor, and author of Abundance Blueprint: A Journey to Financial Harmony.",
  },
  "/book": {
    title:
      "Abundance Blueprint: A Journey to Financial Harmony | Long Money Concepts",
    description:
      "Abundance Blueprint by La'Toya Ray, CPA is a memoir-driven guide to healing the emotional story beneath money, for people who know what to do but still struggle.",
  },
  "/library": {
    title: "The Long Money Library — Guides & Resources | Long Money Concepts",
    description:
      "Free crisis resources, the Financial Foundations guide (digital and print), workshops, and merch from Long Money Concepts — tools that map back to the HEALS™ framework.",
  },
  "/work-with-me": {
    title: "Work With Me — HEALS™ Services | Long Money Concepts",
    description:
      "Financial wellness services from Long Money Concepts built on the HEALS™ Method — the Long Money Circle, Financial Wellness Reset, Advisory Membership, and workshops.",
  },
  "/financial-wellness-reset": {
    title: "The Financial Wellness Reset | Long Money Concepts",
    description:
      "A 12-week, one-on-one guided experience from Long Money Concepts built on the HEALS™ Method — moving you from where you are now into real, structural financial change.",
  },
  "/readiness-assessment": {
    title: "Readiness Assessment | Long Money Concepts",
    description:
      "A quick check to see where you're starting from — and which Long Money Concepts offering fits next.",
  },
  "/contact": {
    title: "Contact La'Toya Ray, CPA | Long Money Concepts",
    description:
      "Reach La'Toya Ray, CPA and Long Money Concepts for speaking, bulk book orders, press, and collaboration.",
  },
  "/circle": {
    title: "The Long Money Circle — Free Community | Long Money Concepts",
    description:
      "A free Facebook community for honest conversations about money, financial healing, and building Financial Harmony — led by La'Toya Ray, CPA.",
  },
  "/blog": {
    title: "Blog — Money, Healing & Financial Harmony | Long Money Concepts",
    description:
      "Stories, reflections, and practical notes on money, healing, and building a life of financial harmony from La'Toya Ray, CPA and Long Money Concepts.",
  },
  "/privacy": {
    title: "Privacy Policy | Long Money Concepts",
    description:
      "How Long Money Concepts and La'Toya Ray, CPA collect, use, and protect your personal information.",
  },
  "/terms": {
    title: "Terms of Service | Long Money Concepts",
    description:
      "The terms and conditions for using the Long Money Concepts website by La'Toya Ray, CPA.",
  },
};

type SeoContextValue = { pages: Record<string, PublicPageSeo> };

const SeoContext = createContext<SeoContextValue>({ pages: STATIC_PAGE_META });

export function absoluteUrl(path = "/"): string {
  if (!path || path === "/") return `${SITE_URL}/`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
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

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function upsertJsonLd(id: string, data: Record<string, unknown>) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/icon-512.png`,
        sameAs: [INSTAGRAM_URL],
        founder: { "@id": `${SITE_URL}/#person` },
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: "La'Toya Ray",
        jobTitle: "CPA",
        url: absoluteUrl("/about"),
        worksFor: { "@id": `${SITE_URL}/#organization` },
        sameAs: [INSTAGRAM_URL],
        description:
          "CPA, founder of Long Money Concepts, and author of Abundance Blueprint: A Journey to Financial Harmony.",
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en-US",
      },
      {
        "@type": "Book",
        "@id": `${SITE_URL}/#book`,
        name: "Abundance Blueprint: A Journey to Financial Harmony",
        alternateName: "Abundance Blueprint",
        author: { "@id": `${SITE_URL}/#person` },
        url: absoluteUrl("/book"),
        description:
          "A memoir-driven guide to healing the emotional story beneath spending, debt, hustle, and financial exhaustion.",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}

function applyMeta({
  title,
  description,
  robots,
  canonicalPath,
  ogImage,
}: {
  title: string;
  description: string;
  robots: string;
  canonicalPath: string;
  ogImage: string;
}) {
  const url = absoluteUrl(canonicalPath);

  document.title = title;
  upsertNamedMeta("description", description);
  upsertNamedMeta("robots", robots);
  upsertNamedMeta("author", AUTHOR_NAME);

  upsertLink("canonical", url);

  upsertPropertyMeta("og:title", title);
  upsertPropertyMeta("og:description", description);
  upsertPropertyMeta("og:type", "website");
  upsertPropertyMeta("og:url", url);
  upsertPropertyMeta("og:image", ogImage);
  upsertPropertyMeta("og:site_name", SITE_NAME);
  upsertPropertyMeta("og:locale", "en_US");

  upsertNamedMeta("twitter:card", "summary_large_image");
  upsertNamedMeta("twitter:title", title);
  upsertNamedMeta("twitter:description", description);
  upsertNamedMeta("twitter:image", ogImage);
}

/**
 * Injects Organization / Person / Book / WebSite JSON-LD once for the whole app,
 * and loads editable page SEO from the API when available.
 */
export function SeoProvider({ children }: { children: ReactNode }) {
  const [pages, setPages] =
    useState<Record<string, PublicPageSeo>>(STATIC_PAGE_META);

  useEffect(() => {
    upsertJsonLd("ld-json-site", siteJsonLd());
  }, []);

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

/**
 * Sets the document title and meta tags for the current page. Resolution order:
 * explicit prop -> SEO context (by path) -> static fallback -> site default.
 * Renders nothing.
 */
export function PageMeta({
  path,
  title,
  description,
  canonicalPath,
  ogImage,
  noindex = false,
}: {
  path?: string;
  title?: string;
  description?: string;
  /** Absolute path used for canonical / og:url. Defaults to `path` or `/`. */
  canonicalPath?: string;
  ogImage?: string;
  noindex?: boolean;
}) {
  const { pages } = useContext(SeoContext);
  const fromMap = path ? (pages[path] ?? STATIC_PAGE_META[path]) : undefined;

  const finalTitle =
    (title && title.trim()) || fromMap?.title || DEFAULT_TITLE;
  const finalDescription =
    (description && description.trim()) ||
    fromMap?.description ||
    DEFAULT_DESCRIPTION;
  const robots = noindex ? "noindex, nofollow" : "index, follow";
  const finalCanonical = canonicalPath || path || "/";
  const finalOgImage = ogImage?.trim() || DEFAULT_OG_IMAGE;

  useEffect(() => {
    applyMeta({
      title: finalTitle,
      description: finalDescription,
      robots,
      canonicalPath: finalCanonical,
      ogImage: finalOgImage,
    });
  }, [finalTitle, finalDescription, robots, finalCanonical, finalOgImage]);

  return null;
}
