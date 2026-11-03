export type PodcastAppearance = {
  id: number;
  showName: string;
  episodeTitle: string;
  publishedDate: string;
  episodeLink: string;
  embedCode: string;
  description: string;
};

export type PodcastAppearancesResult =
  | { ok: true; appearances: PodcastAppearance[] }
  | { ok: false; error: string; appearances: PodcastAppearance[] };

export async function fetchPodcastAppearances(): Promise<PodcastAppearancesResult> {
  try {
    const response = await fetch("/api/podcast-appearances", {
      headers: { Accept: "application/json" },
    });
    const data = (await response.json()) as {
      ok?: boolean;
      error?: string;
      appearances?: PodcastAppearance[];
    };
    const appearances = Array.isArray(data.appearances)
      ? data.appearances
      : [];

    if (!response.ok || data.ok === false) {
      return {
        ok: false,
        error: data.error ?? "Could not load podcast appearances right now.",
        appearances,
      };
    }

    return { ok: true, appearances };
  } catch {
    return {
      ok: false,
      error: "Could not load podcast appearances right now.",
      appearances: [],
    };
  }
}

function parseIsoDate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

/** e.g. "Nov 3, 2026" */
export function formatAppearanceDate(isoDate: string): string {
  const date = parseIsoDate(isoDate);
  if (!date) return isoDate;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const ALLOWED_EMBED_HOSTS = new Set([
  "open.spotify.com",
  "www.youtube.com",
  "youtube.com",
  "www.youtube-nocookie.com",
  "youtube-nocookie.com",
]);

export type SafePodcastEmbed = {
  src: string;
  height: number;
  title: string;
};

/**
 * Pull a safe Spotify/YouTube iframe src out of pasted embed markup.
 * Avoids injecting arbitrary HTML.
 */
export function parseSafePodcastEmbed(
  embedCode: string,
  fallbackTitle = "Podcast episode",
): SafePodcastEmbed | null {
  const raw = embedCode.trim();
  if (!raw) return null;

  const srcMatch =
    /\bsrc\s*=\s*["']([^"']+)["']/i.exec(raw) ??
    /\bsrc\s*=\s*([^\s>]+)/i.exec(raw);
  if (!srcMatch) return null;

  let src: string;
  try {
    const url = new URL(srcMatch[1].trim());
    if (url.protocol !== "https:") return null;
    if (!ALLOWED_EMBED_HOSTS.has(url.hostname)) return null;
    src = url.toString();
  } catch {
    return null;
  }

  const heightMatch = /\bheight\s*=\s*["']?(\d+)/i.exec(raw);
  const parsedHeight = heightMatch ? Number(heightMatch[1]) : NaN;
  const height =
    Number.isFinite(parsedHeight) && parsedHeight >= 80 && parsedHeight <= 900
      ? parsedHeight
      : src.includes("youtube")
        ? 315
        : 152;

  const titleMatch = /\btitle\s*=\s*["']([^"']+)["']/i.exec(raw);

  return {
    src,
    height,
    title: titleMatch?.[1]?.trim() || fallbackTitle,
  };
}
