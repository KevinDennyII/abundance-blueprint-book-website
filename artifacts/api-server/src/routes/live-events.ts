import { Router, type IRouter } from "express";

const router: IRouter = Router();

/** Published Google Sheet CSV for Long Money Live events. */
const LIVE_EVENTS_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTF4KFJK_fThcwFW2iT0tAyF0ETpTt54PhXB6sjK0-RI03jAI7byjZPYfjiB5PUkYceVkoD2uvgxKfO/pub?gid=0&single=true&output=csv";

export type LiveEvent = {
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

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      continue;
    }

    if (ch === ",") {
      row.push(field);
      field = "";
      continue;
    }

    if (ch === "\n" || (ch === "\r" && next === "\n")) {
      row.push(field);
      field = "";
      if (row.some((cell) => cell.trim() !== "")) {
        rows.push(row);
      }
      row = [];
      if (ch === "\r") i++;
      continue;
    }

    if (ch === "\r") {
      row.push(field);
      field = "";
      if (row.some((cell) => cell.trim() !== "")) {
        rows.push(row);
      }
      row = [];
      continue;
    }

    field += ch;
  }

  row.push(field);
  if (row.some((cell) => cell.trim() !== "")) {
    rows.push(row);
  }

  return rows;
}

function normalizeHeader(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function isShown(value: string): boolean {
  const v = value.trim().toUpperCase();
  return v === "TRUE" || v === "YES" || v === "1" || v === "CHECKED";
}

/** Parse common sheet date strings into a local calendar date (no timezone shift). */
function parseEventDate(raw: string): Date | null {
  const value = raw.trim();
  if (!value) return null;

  const us = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value);
  if (us) {
    const month = Number(us[1]);
    const day = Number(us[2]);
    const year = Number(us[3]);
    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    ) {
      return date;
    }
    return null;
  }

  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (iso) {
    const year = Number(iso[1]);
    const month = Number(iso[2]);
    const day = Number(iso[3]);
    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    ) {
      return date;
    }
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
}

function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function col(
  map: Record<string, number>,
  row: string[],
  ...names: string[]
): string {
  for (const name of names) {
    const idx = map[normalizeHeader(name)];
    if (idx !== undefined) {
      return (row[idx] ?? "").trim();
    }
  }
  return "";
}

function parseEvents(csvText: string): LiveEvent[] {
  const rows = parseCsv(csvText.replace(/^\uFEFF/, ""));
  if (rows.length < 2) return [];

  const headerMap: Record<string, number> = {};
  rows[0].forEach((header, index) => {
    headerMap[normalizeHeader(header)] = index;
  });

  const today = startOfToday();
  const events: Array<LiveEvent & { sortKey: number }> = [];

  for (const row of rows.slice(1)) {
    if (!isShown(col(headerMap, row, "show on site"))) continue;

    const dateRaw = col(headerMap, row, "date");
    const eventDate = parseEventDate(dateRaw);
    if (!eventDate || eventDate < today) continue;

    const title = col(headerMap, row, "title");
    if (!title) continue;

    events.push({
      date: toIsoDate(eventDate),
      time: col(headerMap, row, "time"),
      type: col(headerMap, row, "type"),
      title,
      venue: col(headerMap, row, "venue"),
      address: col(headerMap, row, "address"),
      cityState: col(headerMap, row, "city, state", "city state"),
      price: col(headerMap, row, "price"),
      rsvpLink: col(headerMap, row, "rsvp link", "rsvp"),
      sortKey: eventDate.getTime(),
    });
  }

  events.sort((a, b) => a.sortKey - b.sortKey);

  return events.map(({ sortKey: _sortKey, ...event }) => event);
}

router.get("/live/events", async (_req, res) => {
  try {
    const response = await fetch(LIVE_EVENTS_CSV_URL, {
      headers: {
        Accept: "text/csv,text/plain,*/*",
        "User-Agent": "LongMoneyConceptsLive/1.0",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      res.status(502).json({
        ok: false,
        error: "Could not load events right now.",
        events: [],
      });
      return;
    }

    const csvText = await response.text();
    const events = parseEvents(csvText);
    res.setHeader("Cache-Control", "public, max-age=300");
    res.json({ ok: true, events });
  } catch {
    res.status(502).json({
      ok: false,
      error: "Could not load events right now.",
      events: [],
    });
  }
});

export default router;
