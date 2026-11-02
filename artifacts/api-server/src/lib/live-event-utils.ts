export type RepeatInterval = "weekly" | "biweekly" | "monthly";

export const REPEAT_INTERVALS: readonly RepeatInterval[] = [
  "weekly",
  "biweekly",
  "monthly",
] as const;

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const MAX_OCCURRENCES = 52;

export function isIsoDate(value: string): boolean {
  const match = ISO_DATE.exec(value.trim());
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function parseIsoDate(value: string): Date | null {
  if (!isIsoDate(value)) return null;
  const [y, m, d] = value.trim().split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function isRepeatInterval(value: unknown): value is RepeatInterval {
  return (
    typeof value === "string" &&
    (REPEAT_INTERVALS as readonly string[]).includes(value)
  );
}

function addInterval(date: Date, interval: RepeatInterval): Date {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  if (interval === "weekly") {
    next.setDate(next.getDate() + 7);
    return next;
  }
  if (interval === "biweekly") {
    next.setDate(next.getDate() + 14);
    return next;
  }
  // monthly — same day-of-month when possible; clamp to last day of month
  const day = next.getDate();
  next.setMonth(next.getMonth() + 1);
  if (next.getDate() < day) {
    next.setDate(0);
  }
  return next;
}

/**
 * Inclusive range from startDate through endDate, stepping by interval.
 * Caps at MAX_OCCURRENCES. Always includes the start date.
 */
export function expandOccurrenceDates(
  startIso: string,
  endIso: string,
  interval: RepeatInterval,
): string[] | { error: string } {
  const start = parseIsoDate(startIso);
  const end = parseIsoDate(endIso);
  if (!start || !end) {
    return { error: "Start and end dates must be valid YYYY-MM-DD values." };
  }
  if (end < start) {
    return { error: "Repeat end date must be on or after the start date." };
  }

  const dates: string[] = [toIsoDate(start)];
  let cursor = start;
  while (dates.length < MAX_OCCURRENCES) {
    cursor = addInterval(cursor, interval);
    if (cursor > end) break;
    dates.push(toIsoDate(cursor));
  }

  return dates;
}

export function newSeriesId(): string {
  return crypto.randomUUID();
}
