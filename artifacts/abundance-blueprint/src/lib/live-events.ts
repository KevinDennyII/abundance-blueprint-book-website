export type LiveEvent = {
  id?: number;
  date: string;
  time: string;
  type: string;
  title: string;
  venue: string;
  address: string;
  cityState: string;
  price: string;
  rsvpLink: string;
};

export type LiveEventsResult =
  | { ok: true; events: LiveEvent[] }
  | { ok: false; error: string; events: LiveEvent[] };

export async function fetchLiveEvents(): Promise<LiveEventsResult> {
  try {
    const response = await fetch("/api/live/events", {
      headers: { Accept: "application/json" },
    });
    const data = (await response.json()) as {
      ok?: boolean;
      error?: string;
      events?: LiveEvent[];
    };
    const events = Array.isArray(data.events) ? data.events : [];

    if (!response.ok || data.ok === false) {
      return {
        ok: false,
        error: data.error ?? "Could not load events right now.",
        events,
      };
    }

    return { ok: true, events };
  } catch {
    return {
      ok: false,
      error: "Could not load events right now.",
      events: [],
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

export function formatEventMonth(isoDate: string): string {
  const date = parseIsoDate(isoDate);
  if (!date) return "";
  return date.toLocaleDateString("en-US", { month: "short" });
}

export function formatEventDay(isoDate: string): string {
  const date = parseIsoDate(isoDate);
  if (!date) return "";
  return String(date.getDate());
}

/** e.g. "Saturday, 11:00 AM" */
export function formatEventWhen(isoDate: string, time: string): string {
  const date = parseIsoDate(isoDate);
  const weekday = date
    ? date.toLocaleDateString("en-US", { weekday: "long" })
    : "";
  const trimmedTime = time.trim();
  if (weekday && trimmedTime) return `${weekday}, ${trimmedTime}`;
  return weekday || trimmedTime;
}

export function googleMapsUrl(event: LiveEvent): string | null {
  const parts = [event.address, event.cityState, event.venue]
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length === 0) return null;
  // Prefer street + city when available; fall back to venue + city.
  const query =
    event.address.trim() && event.cityState.trim()
      ? `${event.address.trim()}, ${event.cityState.trim()}`
      : parts.join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
