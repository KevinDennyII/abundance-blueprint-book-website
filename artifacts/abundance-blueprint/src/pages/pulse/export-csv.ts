import { THIS_WEEK, calc, hasWeek } from "./math";
import type { PulseState } from "./types";

function q(s: unknown): string {
  return `"${String(s ?? "").replace(/"/g, '""')}"`;
}

/** Build CSV and trigger a browser download. Returns a status message. */
export function downloadPulseCsv(S: PulseState): string {
  const ids = Object.keys(S.weeks)
    .filter((id) => hasWeek(S.weeks[id]))
    .sort();
  if (!ids.length) {
    return "There's nothing to download yet. Check your first pulse.";
  }

  const head = [
    "Week of",
    "Money in",
    "What the work cost",
    "What the work made",
    "Tax set-aside",
    "Moved to tax savings",
    "Business bills",
    "Set-aside for supplies and other costs",
    "Left for the business",
    "Business costs paid personally",
    "Felt",
    "What drove it",
    "Paid myself / came in",
    "Pay type",
    "Other household income",
    "Personal bills",
    "Left for everyday living",
    "Personal costs paid from business",
    "Surprises",
    "One thing I noticed",
  ];

  const lines = [head.map(q).join(",")].concat(
    ids.map((id) => {
      const x = S.weeks[id];
      const c = calc(x, S);
      return [
        id,
        c.inc,
        c.jobs,
        c.made,
        c.tax,
        x.moved ? "Yes" : "No",
        c.bills,
        c.sup,
        c.left,
        c.bp,
        x.feel,
        x.drove,
        c.paid,
        x.payType === "set"
          ? "Set amount"
          : x.payType === "whatever"
            ? "Whatever I needed"
            : "",
        c.other,
        c.pb,
        c.living,
        c.pbiz,
        c.surp,
        x.noticed,
      ]
        .map(q)
        .join(",");
    }),
  );

  const blob = new Blob([lines.join("\n")], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `money-pulse-${THIS_WEEK}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  return "Your tracker was downloaded.";
}
