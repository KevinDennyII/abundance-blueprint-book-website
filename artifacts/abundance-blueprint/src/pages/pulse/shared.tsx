import type { ReactNode } from "react";
import { FEEL_COLOR, FEELS, cap } from "./math";
import type { Feel, NamedAmount, PulseMode } from "./types";

export function MoneyInput({
  id,
  value,
  label,
  onChange,
}: {
  id: string;
  value: string;
  label: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="money" htmlFor={id}>
      <span>$</span>
      <input
        id={id}
        inputMode="decimal"
        autoComplete="off"
        placeholder="0"
        value={value}
        aria-label={label}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export function ListEditor({
  items,
  placeholder,
  onChange,
}: {
  items: NamedAmount[];
  placeholder: string;
  onChange: (next: NamedAmount[]) => void;
}) {
  return (
    <div className="list">
      {items.map((it, i) => (
        <div className="row" key={i}>
          <input
            placeholder={placeholder}
            value={it.name}
            aria-label="What it is"
            onChange={(e) => {
              const next = items.slice();
              next[i] = { ...next[i], name: e.target.value };
              onChange(next);
            }}
          />
          <input
            className="amt"
            inputMode="decimal"
            placeholder="$0"
            value={it.amt}
            aria-label="Amount"
            onChange={(e) => {
              const next = items.slice();
              next[i] = { ...next[i], amt: e.target.value };
              onChange(next);
            }}
          />
          <button
            type="button"
            className="x"
            aria-label="Remove"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        className="add"
        onClick={() => onChange([...items, { name: "", amt: "" }])}
      >
        + Add one
      </button>
    </div>
  );
}

export function FeelChips({
  mode,
  feel,
  drove,
  onFeel,
  onDrove,
}: {
  mode: Exclude<PulseMode, "">;
  feel: Feel;
  drove: string;
  onFeel: (f: Feel) => void;
  onDrove: (v: string) => void;
}) {
  return (
    <>
      <div className="chips">
        {FEELS[mode].map((f) => (
          <button
            key={f}
            type="button"
            className="chip"
            aria-pressed={feel === f}
            onClick={() => onFeel(feel === f ? "" : (f as Feel))}
          >
            <i
              className="dot"
              style={{ background: `var(--${FEEL_COLOR[f]})` }}
            />
            {cap(f)}
          </button>
        ))}
      </div>
      <input
        className="text"
        placeholder="What drove it?"
        value={drove}
        aria-label="What drove it"
        onChange={(e) => onDrove(e.target.value)}
      />
    </>
  );
}

export function DemoBanner({
  hasMine,
  onStart,
}: {
  hasMine: boolean;
  onStart: () => void;
}) {
  return (
    <div className="demo">
      <div>
        <strong>This is an example.</strong>
        Nine weeks from a hair stylist, so you can see how it works. Nothing you
        type here is saved.
      </div>
      <div>
        <button type="button" className="btn small" onClick={onStart}>
          {hasMine ? "Back to my pulse" : "Start my own pulse"}
        </button>
      </div>
    </div>
  );
}

export function RulesBlock({
  mode,
  onGotIt,
}: {
  mode: Exclude<PulseMode, "">;
  onGotIt: () => void;
}) {
  const r =
    mode === "personal"
      ? [
          [
            "Know what's already spoken for.",
            "Before you decide what you can spend, look at what's due before your next check. Money that's already promised to a bill isn't free to spend, even if it's sitting in your account.",
          ],
          [
            "Notice, don't judge.",
            "A small number, or even a negative one, is information, not failure. Seeing it early is the whole point.",
          ],
        ]
      : [
          [
            "Business first, then you.",
            "Most owners start with what they personally need, then try to keep the business going with whatever is left. That turns the business into an ATM, and an ATM can't plan for a slow season. Check the business first. Then pay yourself from what it can truly afford.",
          ],
          [
            "Don't spend every wave.",
            "Your income will rise and fall. Busy weeks have to help carry the slow ones. The 13 Weeks tab shows your own pattern.",
          ],
        ];
  const how =
    mode === "personal"
      ? "Pick one day each week, right after something you already do, like Sunday dinner. Bring your bank app and look at every account. Fill in your Money Map once. Show up, even when there's nothing there. The habit matters more than the numbers."
      : "Pick one day each week, right after something you already do, like Sunday dinner. Bring your bank app and look at every account, business and personal. Show up, even when there's nothing there. In the beginning, the habit matters more than the numbers.";

  return (
    <section className="rules">
      <h3>Two rules before you start</h3>
      <ol>
        {r.map(([a, b]) => (
          <li key={a}>
            <b>{a}</b> {b}
          </li>
        ))}
      </ol>
      <p className="hint">
        {how} Ask someone to ask you, &quot;Did you check the pulse?&quot; It
        helps the habit stick.
      </p>
      <div>
        <button type="button" className="btn small" onClick={onGotIt}>
          Got it
        </button>
      </div>
    </section>
  );
}

export function PartHead({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="part-head">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  );
}

export function ModeBar({
  demo,
  mode,
  onMode,
}: {
  demo: boolean;
  mode: PulseMode;
  onMode: (m: Exclude<PulseMode, "">) => void;
}) {
  const opts: [Exclude<PulseMode, "">, string][] = [
    ["full", "Business"],
    ["books", "Books elsewhere"],
    ["personal", "Personal only"],
  ];
  return (
    <div className="modebar">
      <span className="k">{demo ? "Start my own:" : "My pulse:"}</span>
      <div className="chips">
        {opts.map(([k, l]) => (
          <button
            key={k}
            type="button"
            className="chip"
            aria-pressed={!demo && mode === k}
            onClick={() => onMode(k)}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Nudges({ items }: { items: ReactNode[] }) {
  if (!items.length) return null;
  return (
    <div className="nudges">
      {items.map((t, i) => (
        <div className="nudge" key={i}>
          {t}
        </div>
      ))}
    </div>
  );
}

export function Line({ n, children }: { n: number; children: ReactNode }) {
  return (
    <div className="line">
      <span className="n">{n}</span>
      <div className="body">{children}</div>
    </div>
  );
}

export function feelPill(f: Feel) {
  const col = f && FEEL_COLOR[f];
  if (!col) return <span className="muted">—</span>;
  return <span className={`pill ${f}`}>{cap(f)}</span>;
}
