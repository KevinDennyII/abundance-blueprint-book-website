/**
 * Public Kit creator-site posts (letter.longmoneyconcepts.com /
 * longmoneyletter.com). No API key required — pages embed post JSON in
 * `window.__PROPS__`.
 */

export type KitCreatorPostSummary = {
  id: number;
  title: string;
  slug: string;
  url: string;
  publishedAt: string | null;
  metaDescription: string;
  introContent: string;
};

export type KitCreatorPostDetail = KitCreatorPostSummary & {
  contentHtml: string;
};

const DEFAULT_KIT_LETTER_SITE = "https://letter.longmoneyconcepts.com";

export function kitLetterSiteUrl(): string {
  const fromEnv = process.env.KIT_LETTER_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return DEFAULT_KIT_LETTER_SITE;
}

function extractProps(html: string): Record<string, unknown> {
  const marker = "window.__PROPS__ = ";
  const start = html.indexOf(marker);
  if (start < 0) {
    throw new Error("Kit page did not include window.__PROPS__");
  }

  const slice = html.slice(start + marker.length);
  let i = 0;
  let depth = 0;
  let inStr = false;
  let esc = false;
  let quote = "";

  for (; i < slice.length; i++) {
    const c = slice[i]!;
    if (inStr) {
      if (esc) {
        esc = false;
        continue;
      }
      if (c === "\\") {
        esc = true;
        continue;
      }
      if (c === quote) inStr = false;
      continue;
    }
    if (c === "'" || c === '"') {
      inStr = true;
      quote = c;
      continue;
    }
    if (c === "{") depth++;
    if (c === "}") {
      depth--;
      if (depth === 0) {
        i++;
        break;
      }
    }
  }

  return JSON.parse(slice.slice(0, i)) as Record<string, unknown>;
}

function asPostSummary(raw: unknown): KitCreatorPostSummary | null {
  if (!raw || typeof raw !== "object") return null;
  const p = raw as Record<string, unknown>;
  const id = typeof p.id === "number" ? p.id : Number(p.id);
  const title = typeof p.title === "string" ? p.title.trim() : "";
  const slug = typeof p.slug === "string" ? p.slug.trim() : "";
  if (!Number.isFinite(id) || !title || !slug) return null;

  const url =
    typeof p.url === "string" && p.url.trim()
      ? p.url.trim()
      : `${kitLetterSiteUrl()}/posts/${slug}`;

  return {
    id,
    title,
    slug,
    url,
    publishedAt:
      typeof p.publishedAt === "string" && p.publishedAt.trim()
        ? p.publishedAt
        : null,
    metaDescription:
      typeof p.metaDescription === "string" ? p.metaDescription.trim() : "",
    introContent:
      typeof p.introContent === "string" ? p.introContent.trim() : "",
  };
}

async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent": "LongMoneyConceptsLetterSync/1.0",
    },
  });
  if (!response.ok) {
    throw new Error(`Kit fetch failed (${response.status}) for ${url}`);
  }
  return response.text();
}

/** List published posts from the public creator profile. */
export async function listKitCreatorPosts(): Promise<{
  posts: KitCreatorPostSummary[];
  hasMore: boolean;
}> {
  const base = kitLetterSiteUrl();
  const props = extractProps(await fetchHtml(`${base}/profile/posts`));

  const bySlug = new Map<string, KitCreatorPostSummary>();
  const candidates = [
    props.featuredPost,
    ...((Array.isArray(props.recentPosts) ? props.recentPosts : []) as unknown[]),
  ];

  for (const raw of candidates) {
    const summary = asPostSummary(raw);
    if (summary) bySlug.set(summary.slug, summary);
  }

  const posts = [...bySlug.values()].sort((a, b) => {
    const aTime = a.publishedAt ? Date.parse(a.publishedAt) : 0;
    const bTime = b.publishedAt ? Date.parse(b.publishedAt) : 0;
    return bTime - aTime;
  });

  return {
    posts,
    hasMore: props.hasMore === true,
  };
}

/** Full post HTML + metadata from the public post page. */
export async function fetchKitCreatorPost(
  slugOrUrl: string,
): Promise<KitCreatorPostDetail> {
  const base = kitLetterSiteUrl();
  const url = slugOrUrl.startsWith("http")
    ? slugOrUrl
    : `${base}/posts/${slugOrUrl.replace(/^\/+/, "")}`;

  const props = extractProps(await fetchHtml(url));
  const summary = asPostSummary(props.post);
  if (!summary) {
    throw new Error(`Kit post payload missing for ${url}`);
  }

  const contentHtml =
    typeof props.content === "string" ? props.content : "";
  if (!contentHtml.trim()) {
    throw new Error(`Kit post content empty for ${summary.slug}`);
  }

  return {
    ...summary,
    contentHtml,
  };
}
