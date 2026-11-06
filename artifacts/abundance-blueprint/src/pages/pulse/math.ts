import type {
  CalcResult,
  Feel,
  NamedAmount,
  PulseMode,
  PulseState,
  WeekData,
} from "./types";

/** Tax on what the work made (income − job costs), matching the artifact. */
export const JOB_COSTS = true;

export const FEELS: Record<"full" | "books" | "personal", string[]> = {
  full: ["slow", "normal", "busy"],
  books: ["slow", "normal", "busy"],
  personal: ["tight", "okay", "comfortable"],
};

export const FEEL_COLOR: Record<string, string> = {
  slow: "slow",
  normal: "normal",
  busy: "busy",
  tight: "slow",
  okay: "normal",
  comfortable: "busy",
};

const MON = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const pad = (x: number) => String(x).padStart(2, "0");

export const iso = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function fromIso(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function weekId(d: Date): string {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const off = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - off);
  return iso(x);
}

export function addWeeks(id: string, k: number): string {
  const d = fromIso(id);
  d.setDate(d.getDate() + 7 * k);
  return iso(d);
}

export function rangeLabel(id: string): string {
  const a = fromIso(id);
  const b = fromIso(addWeeks(id, 1));
  b.setDate(b.getDate() - 1);
  return a.getMonth() === b.getMonth()
    ? `${MON[a.getMonth()]} ${a.getDate()} – ${b.getDate()}`
    : `${MON[a.getMonth()]} ${a.getDate()} – ${MON[b.getMonth()]} ${b.getDate()}`;
}

export function shortLabel(id: string): string {
  const a = fromIso(id);
  return `${MON[a.getMonth()]} ${a.getDate()}`;
}

export const THIS_WEEK = weekId(new Date());

export const n = (v: unknown): number => {
  const x = parseFloat(String(v ?? "").replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(x) ? x : 0;
};

export const r2 = (x: number) => Math.round(x * 100) / 100;

export const sum = (arr: NamedAmount[] | undefined) =>
  (arr || []).reduce((t, i) => t + n(i.amt), 0);

export function fmt(x: number): string {
  const neg = x < 0;
  const a = Math.abs(r2(x));
  const s = a.toLocaleString("en-US", {
    minimumFractionDigits: a % 1 ? 2 : 0,
    maximumFractionDigits: 2,
  });
  return (neg ? "−$" : "$") + s;
}

export const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : "");

export function blankWeek(): WeekData {
  return {
    inc: "",
    jobCosts: [],
    moved: false,
    taxAmt: "",
    bills: [],
    sup: "",
    bizPersonal: [],
    feel: "",
    drove: "",
    paid: "",
    payType: "",
    other: "",
    pbills: [],
    persBiz: [],
    surprises: [],
    noticed: "",
    done: false,
  };
}

export function blankMap() {
  return {
    checks: [
      { date: "", amt: "", bills: [] as { name: string; due: string; amt: string }[] },
      { date: "", amt: "", bills: [] },
    ],
    yearly: [] as { name: string; when: string; amt: string }[],
  };
}

export function freshState(): PulseState {
  return {
    settings: {
      taxRate: 30,
      introSeen: false,
      mode: "",
      need: "",
      taxSavings: "",
    },
    weeks: {},
    map: blankMap(),
    updatedAt: 0,
  };
}

export function hasWeek(w: WeekData | undefined): boolean {
  return !!(
    w &&
    (w.done ||
      String(w.inc || "").trim() !== "" ||
      String(w.paid || "").trim() !== "" ||
      String(w.other || "").trim() !== "")
  );
}

export function anyData(s: PulseState | null | undefined): boolean {
  return !!(s && s.weeks && Object.values(s.weeks).some(hasWeek));
}

export function normalize(s: Partial<PulseState> | null | undefined): PulseState {
  const out = Object.assign(freshState(), s || {});
  out.settings = Object.assign(freshState().settings, s?.settings || {});
  out.map = Object.assign(blankMap(), s?.map || {});
  const weeks: Record<string, WeekData> = {};
  Object.keys(out.weeks || {}).forEach((id) => {
    weeks[id] = Object.assign(blankWeek(), out.weeks[id]);
  });
  out.weeks = weeks;
  if (!out.settings.mode && anyData(out)) out.settings.mode = "full";
  return out;
}

export function modeOf(s: PulseState): Exclude<PulseMode, ""> {
  return (s.settings.mode || "full") as Exclude<PulseMode, "">;
}

export function calc(w: WeekData, s: PulseState): CalcResult {
  const m = modeOf(s);
  const inc = n(w.inc);
  const jobs = JOB_COSTS ? sum(w.jobCosts) : 0;
  const made = r2(inc - jobs);
  const rate = n(s.settings.taxRate) / 100;
  const tax = m === "books" ? n(w.taxAmt) : r2(Math.max(made, 0) * rate);
  const bills = sum(w.bills);
  const sup = n(w.sup);
  const left = r2(made - tax - bills - sup);
  const paid = n(w.paid);
  const other = m === "personal" ? 0 : n(w.other);
  const pb = sum(w.pbills);
  const living = r2(paid + other - pb);
  return {
    inc,
    jobs,
    made,
    tax,
    bills,
    sup,
    left,
    bp: sum(w.bizPersonal),
    paid,
    other,
    pb,
    living,
    pbiz: sum(w.persBiz),
    surp: sum(w.surprises),
  };
}

export function weeklySetAside(s: PulseState): number {
  return r2((s.map.yearly || []).reduce((t, y) => t + n(y.amt) / 52, 0));
}

export function ensureWeek(s: PulseState, cur: string): WeekData {
  if (!s.weeks[cur]) s.weeks[cur] = blankWeek();
  return s.weeks[cur];
}

export type WindowRow = {
  id: string;
  w: WeekData | undefined;
  c: CalcResult | null;
};

export function windowRows(s: PulseState): WindowRow[] {
  const ids: string[] = [];
  for (let i = 12; i >= 0; i--) ids.push(addWeeks(THIS_WEEK, -i));
  return ids.map((id) => ({
    id,
    w: s.weeks[id],
    c: s.weeks[id] ? calc(s.weeks[id], s) : null,
  }));
}

export function decisions(rows: WindowRow[]) {
  const checked = rows.filter((r) => hasWeek(r.w) && r.c);
  const k = checked.length;
  const avg = (f: (r: WindowRow) => number) =>
    k ? checked.reduce((t, r) => t + f(r), 0) / k : 0;
  const lefts = checked.map((r) => r.c!.left).sort((a, b) => a - b);
  const trimmed = lefts.length >= 5 ? lefts.slice(2, -2) : lefts;
  const normal = trimmed.length
    ? r2(trimmed.reduce((t, x) => t + x, 0) / trimmed.length)
    : 0;
  let streak = 0;
  let best = 0;
  rows.forEach((r) => {
    if (hasWeek(r.w) && r.w!.feel === "slow") {
      streak++;
      best = Math.max(best, streak);
    } else streak = 0;
  });
  return {
    k,
    normal,
    trimmedOut: lefts.length >= 5,
    monthly: r2(normal * 4.33),
    paidAvg: r2(avg((r) => r.c!.paid)),
    slow: best,
    weeklyNeed: r2(
      avg((r) => r.c!.bills + r.c!.sup) + avg((r) => r.c!.paid),
    ),
    taxShould: r2(checked.reduce((t, r) => t + r.c!.tax, 0)),
  };
}

export function feelPillClass(f: Feel): string {
  if (!f) return "";
  return FEEL_COLOR[f] || "";
}
