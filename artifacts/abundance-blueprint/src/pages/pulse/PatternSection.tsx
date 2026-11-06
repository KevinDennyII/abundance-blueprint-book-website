import type { ReactNode } from "react";
import {
  FEEL_COLOR,
  FEELS,
  calc,
  cap,
  decisions,
  fmt,
  hasWeek,
  modeOf,
  n,
  r2,
  shortLabel,
  windowRows,
} from "./math";
import type { CalcResult, PulseMode, PulseState, WeekData } from "./types";
import { DemoBanner, feelPill } from "./shared";

type Props = {
  S: PulseState;
  cur: string;
  demo: boolean;
  hasMine: boolean;
  resetAsk: boolean;
  toolMsg: string;
  onStartOwn: () => void;
  onGotoWeek: (id: string) => void;
  onPatchSettings: (patch: Partial<PulseState["settings"]>) => void;
  onMode: (m: Exclude<PulseMode, "">) => void;
  onExample: () => void;
  onExport: () => void;
  onResetAsk: () => void;
  onResetNo: () => void;
  onResetYes: () => void;
};

export function PatternSection({
  S,
  cur,
  demo,
  hasMine,
  resetAsk,
  toolMsg,
  onStartOwn,
  onGotoWeek,
  onPatchSettings,
  onMode,
  onExample,
  onExport,
  onResetAsk,
  onResetNo,
  onResetYes,
}: Props) {
  const m = modeOf(S);
  const rows = windowRows(S);
  const checked = rows.filter((r) => hasWeek(r.w) && r.c);
  const tot = (f: (r: (typeof checked)[0]) => number) =>
    checked.reduce((t, r) => t + f(r), 0);
  const avg = (f: (r: (typeof checked)[0]) => number) =>
    checked.length ? tot(f) / checked.length : 0;
  const barVal = (c: NonNullable<(typeof rows)[0]["c"]>) =>
    m === "full" ? c.inc : c.paid + c.other;

  let stats: [string, string][];
  if (m === "full") {
    stats = [
      ["Weeks checked", `${checked.length} of 13`],
      ["Money in", fmt(tot((r) => r.c!.inc))],
      [
        "Tax moved to savings",
        fmt(tot((r) => (r.w!.moved ? r.c!.tax : 0))),
      ],
      ["Avg. paid myself", fmt(Math.round(avg((r) => r.c!.paid)))],
    ];
  } else if (m === "books") {
    stats = [
      ["Weeks checked", `${checked.length} of 13`],
      ["Paid myself", fmt(tot((r) => r.c!.paid))],
      [
        "Tax moved to savings",
        fmt(tot((r) => (r.w!.moved ? r.c!.tax : 0))),
      ],
      ["Avg. left for living", fmt(Math.round(avg((r) => r.c!.living)))],
    ];
  } else {
    stats = [
      ["Weeks checked", `${checked.length} of 13`],
      ["Money in", fmt(tot((r) => r.c!.paid))],
      ["Surprises", fmt(tot((r) => r.c!.surp))],
      ["Avg. left for living", fmt(Math.round(avg((r) => r.c!.living)))],
    ];
  }

  const Wd = 600;
  const H = 220;
  const padL = 8;
  const padR = 8;
  const top = 26;
  const base = 180;
  const avgV = avg((r) => barVal(r.c!));
  const max = Math.max(
    1,
    ...rows.map((r) => (r.c ? barVal(r.c) : 0)),
    avgV,
  );
  const step = (Wd - padL - padR) / 13;
  const bw = step * 0.62;
  const y = (v: number) => base - (v / max) * (base - top);

  const feels = FEELS[m];
  const chartTitle =
    m === "full"
      ? "Money in, week by week"
      : m === "books"
        ? "Money in for me, week by week"
        : "Money that came in, week by week";

  const withV = checked.filter((r) => barVal(r.c!) > 0);
  let insight: ReactNode = null;
  if (withV.length >= 3) {
    const hi = withV.reduce((a, b) =>
      barVal(b.c!) > barVal(a.c!) ? b : a,
    );
    const lo = withV.reduce((a, b) =>
      barVal(b.c!) < barVal(a.c!) ? b : a,
    );
    insight = (
      <p className="msg">
        Your strongest week: {fmt(barVal(hi.c!))} ({shortLabel(hi.id)}
        {hi.w!.drove ? `: ${hi.w!.drove}` : ""}). Your slowest:{" "}
        {fmt(barVal(lo.c!))} ({shortLabel(lo.id)}
        {lo.w!.drove ? `: ${lo.w!.drove}` : ""}).
      </p>
    );
  }

  type ColFn = (c: CalcResult, w: WeekData) => string;
  const cols: [string, ColFn][] =
    m === "full"
      ? [
          ["Money in", (c) => fmt(c.inc)],
          ["Tax set aside", (c, w) => fmt(c.tax) + (w.moved ? " ✓" : "")],
          ["Left for the business", (c) => fmt(c.left)],
          ["Paid myself", (c) => fmt(c.paid)],
        ]
      : m === "books"
        ? [
            ["Paid myself", (c) => fmt(c.paid)],
            ["Tax moved", (c, w) => (w.moved ? fmt(c.tax) + " ✓" : "—")],
            ["Left for living", (c) => fmt(c.living)],
          ]
        : [
            ["Came in", (c) => fmt(c.paid)],
            ["Bills", (c) => fmt(c.pb)],
            ["Left for living", (c) => fmt(c.living)],
            ["Surprises", (c) => fmt(c.surp)],
          ];

  const dash = <span className="muted">—</span>;
  const d = decisions(rows);
  const need = n(S.settings.need);
  const ts = String(S.settings.taxSavings).trim();

  const after =
    m === "full" && d.k >= 1 ? (
      <section className="panel">
        <h3>Turn your rows into decisions</h3>
        <p className="msg">
          {d.k < 13
            ? `You have ${d.k} of 13 weeks so far. These numbers fill in now and get more accurate as you go.`
            : "Your last 13 weeks. Set aside about 30 minutes and work through these."}
        </p>
        <div className="steps">
          <div className="step">
            <span className="n">1</span>
            <div className="body">
              <h4>Find your normal week</h4>
              <div className="kv">
                <span>
                  {d.trimmedOut
                    ? "Left for the business, best two and worst two weeks left out"
                    : "Left for the business, average week"}
                </span>
                <b>{fmt(d.normal)}</b>
              </div>
              <div className="kv">
                <span>My normal week times 4.33</span>
                <b>{fmt(d.monthly)}</b>
              </div>
              <div className="kv">
                <label
                  htmlFor="need"
                  style={{ fontSize: 14, color: "var(--ink-2)" }}
                >
                  What my household needs each month
                </label>
                <span className="inline-money">
                  $
                  <input
                    id="need"
                    inputMode="decimal"
                    placeholder="0"
                    value={S.settings.need}
                    onChange={(e) =>
                      onPatchSettings({ need: e.target.value })
                    }
                  />
                </span>
              </div>
              <p className="useit">
                {need > 0
                  ? need > d.monthly
                    ? `Your household needs ${fmt(r2(need - d.monthly))} more a month than the business can steadily pay you. That's your gap, and now you know exactly how big it is.`
                    : "The business can steadily cover what your household needs each month."
                  : "Use it: this is the most the business can steadily pay you each week. Enter what your household needs each month to see your gap."}
              </p>
            </div>
          </div>
          <div className="step">
            <span className="n">2</span>
            <div className="body">
              <h4>Compare it to what you actually paid yourself</h4>
              <div className="kv">
                <span>What I paid myself, per week on average</span>
                <b>{fmt(d.paidAvg)}</b>
              </div>
              <p className="useit">
                {d.paidAvg > d.normal ? (
                  <>
                    That&apos;s <b>{fmt(d.paidAvg - d.normal)}</b> a week more
                    than your normal week. The business made up the difference
                    somewhere: its savings, the tax money, or late bills.
                    That&apos;s where the squeeze came from. Bring your pay down
                    to your normal week, or work on helping the business earn
                    more.
                  </>
                ) : (
                  "You're paying yourself within what the business can usually carry."
                )}
              </p>
            </div>
          </div>
          <div className="step">
            <span className="n">3</span>
            <div className="body">
              <h4>Find your longest slow stretch</h4>
              <div className="kv">
                <span>Most slow weeks in a row</span>
                <b>
                  {d.slow} {d.slow === 1 ? "week" : "weeks"}
                </b>
              </div>
              <p className="useit">
                {d.slow ? (
                  <>
                    That&apos;s how many weeks of bills and pay your business
                    needs saved up, so the next slow stretch doesn&apos;t knock
                    you off balance. At your average bills, set-asides and pay,
                    that&apos;s about{" "}
                    <b>{fmt(r2(d.slow * d.weeklyNeed))}</b>.
                  </>
                ) : (
                  "No slow stretch yet. Keep marking how each week felt, and this will show you how big a cushion to build."
                )}
              </p>
            </div>
          </div>
          <div className="step">
            <span className="n">4</span>
            <div className="body">
              <h4>Check your taxes</h4>
              <div className="kv">
                <span>What I should have set aside</span>
                <b>{fmt(d.taxShould)}</b>
              </div>
              <div className="kv">
                <label
                  htmlFor="taxSavings"
                  style={{ fontSize: 14, color: "var(--ink-2)" }}
                >
                  What&apos;s in my tax savings account
                </label>
                <span className="inline-money">
                  $
                  <input
                    id="taxSavings"
                    inputMode="decimal"
                    placeholder="0"
                    value={S.settings.taxSavings}
                    onChange={(e) =>
                      onPatchSettings({ taxSavings: e.target.value })
                    }
                  />
                </span>
              </div>
              <p className="useit">
                {ts === ""
                  ? "Enter what's in your tax savings account to check it."
                  : n(ts) < d.taxShould
                    ? `You're ${fmt(r2(d.taxShould - n(ts)))} short. That's money you'll be looking for at tax time. Catch up now if you can.`
                    : "Your tax savings covers what you should have set aside."}
              </p>
            </div>
          </div>
        </div>
        <p className="msg">
          The tracker always shows your latest 13 weeks, so a fresh quarter
          starts on its own. Every 13 weeks, your numbers get more accurate and
          your decisions get easier.
        </p>
      </section>
    ) : m === "personal" ? (
      <section className="panel">
        <h3>What your pulse checks teach you</h3>
        <ol className="questions">
          <li>
            <b>Your real numbers.</b> After a few weeks, you&apos;ll know what
            your household actually brings in and what it really costs to run,
            not what you hope or fear it does.
          </li>
          <li>
            <b>Your bill timing.</b> If your money lands at one point in the
            month and your bills are due at another, call your billers. Many
            will move your due date if you ask.
          </li>
          <li>
            <b>Your cushion.</b> When you can see which surprises keep coming
            back, add them to your Money Map and set a little aside each week.
          </li>
          <li>
            <b>Your story.</b> Over time, the pulse also shows you how you feel
            about money, and where those feelings come from. That&apos;s where
            the deeper work begins.
          </li>
        </ol>
      </section>
    ) : (
      <section className="panel">
        <h3>At the end of 13 weeks, ask yourself</h3>
        <ol className="questions">
          <li>Which weeks were slow, and what caused them?</li>
          <li>Did I move my tax set-aside every week?</li>
          <li>
            Did what I paid myself stay steady, or follow the waves?
          </li>
        </ol>
      </section>
    );

  const promo =
    m === "personal" ? (
      <section className="guide">
        <span className="eyebrow">Coming January 2027</span>
        <h3>Abundance Blueprint: A Journey to Financial Harmony</h3>
        <p>
          by LaToya Ray, CPA. Why we handle money the way we do, and how to
          build financial harmony from right where you are.
        </p>
        <p>
          <a href="/circle">Join the Long Money Circle</a>, a free weekly
          community for people doing this work together.
        </p>
        <p>
          Run a business or work for yourself?{" "}
          <button
            type="button"
            onClick={() => onMode("full")}
            style={{
              background: "none",
              border: 0,
              padding: 0,
              color: "var(--gold-hi)",
              font: "inherit",
              fontWeight: 700,
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Switch to the Business Pulse
          </button>
          , built for uneven income. The printable version is at{" "}
          <a href="/library">longmoneyconcepts.com/library</a>.
        </p>
      </section>
    ) : (
      <section className="guide">
        <span className="eyebrow">Available now</span>
        <h3>Your Business Is Not Your ATM</h3>
        <p>
          The full guide for business owners, owner-operators, and 1099
          contractors, by LaToya Ray, CPA. This pulse check shows you your
          numbers. The guide shows you what to do with them: separate business
          and personal money, pay yourself on purpose, build a cushion for the
          slow seasons, and handle taxes as a weekly bill instead of a yearly
          surprise.
        </p>
        <p>
          <a href="/library">Get it at longmoneyconcepts.com/library</a> ·{" "}
          <a href="/circle">Join the Long Money Circle</a>
        </p>
      </section>
    );

  return (
    <>
      {demo ? <DemoBanner hasMine={hasMine} onStart={onStartOwn} /> : null}
      <div className="part-head">
        <span className="eyebrow">Your pattern</span>
        <h2>Riding the Waves</h2>
        {m === "personal" ? (
          <p>
            Week by week, the pulse shows you what happens with your money. Over
            time, it shows you how you feel about it, too.
          </p>
        ) : (
          <p>
            One pulse check tells you how this week went. Thirteen of them tell
            you how your business actually works.
          </p>
        )}
      </div>
      <div className="stats">
        {stats.map(([k, v]) => (
          <div className="stat" key={k}>
            <span className="k">{k}</span>
            <span className="v">{v}</span>
          </div>
        ))}
      </div>
      <section className="panel">
        <h3>{chartTitle}</h3>
        <div className="legend">
          {feels.map((f) => (
            <span key={f}>
              <i style={{ background: `var(--${FEEL_COLOR[f]})` }} />
              {cap(f)}
            </span>
          ))}
          {m === "full" ? (
            <span>
              <i style={{ background: "var(--ink)", height: 3 }} />
              Paid myself
            </span>
          ) : null}
        </div>
        <svg
          className="chart"
          viewBox={`0 0 ${Wd} ${H}`}
          role="img"
          aria-label={chartTitle}
        >
          <line
            x1={padL}
            x2={Wd - padR}
            y1={base}
            y2={base}
            stroke="var(--line)"
          />
          {checked.length ? (
            <>
              <line
                x1={padL}
                x2={Wd - padR}
                y1={y(avgV)}
                y2={y(avgV)}
                stroke="var(--gold)"
                strokeDasharray="5 5"
                strokeWidth={1.5}
              />
              <text
                x={padL}
                y={y(avgV) - 6}
                fontSize={12.5}
                fontWeight={700}
                fill="var(--gold)"
                fontFamily="Lato, sans-serif"
              >
                Average {fmt(Math.round(avgV))}
              </text>
            </>
          ) : null}
          {rows.map((r, i) => {
            const x = padL + i * step + (step - bw) / 2;
            const v = r.c ? barVal(r.c) : 0;
            const nodes: ReactNode[] = [];
            if (hasWeek(r.w) && v > 0) {
              const col =
                r.w!.feel && FEEL_COLOR[r.w!.feel]
                  ? `var(--${FEEL_COLOR[r.w!.feel]})`
                  : "var(--normal)";
              nodes.push(
                <rect
                  key="bar"
                  x={x}
                  y={y(v)}
                  width={bw}
                  height={base - y(v)}
                  rx={3}
                  fill={col}
                >
                  <title>
                    {shortLabel(r.id)}: {fmt(v)}
                  </title>
                </rect>,
              );
              if (m === "full" && r.c!.paid > 0) {
                nodes.push(
                  <line
                    key="pay"
                    x1={x - 2}
                    x2={x + bw + 2}
                    y1={y(Math.min(r.c!.paid, max))}
                    y2={y(Math.min(r.c!.paid, max))}
                    stroke="var(--ink)"
                    strokeWidth={2.5}
                  />,
                );
              }
            } else {
              nodes.push(
                <circle
                  key="empty"
                  cx={x + bw / 2}
                  cy={base - 4}
                  r={3}
                  fill="var(--line)"
                />,
              );
            }
            if (i === 0 || i === 6 || i === 12) {
              nodes.push(
                <text
                  key="lab"
                  x={x + bw / 2}
                  y={base + 22}
                  textAnchor="middle"
                  fontSize={13}
                  fill="var(--ink-2)"
                  fontFamily="Lato, sans-serif"
                >
                  {i === 12 ? "This week" : shortLabel(r.id)}
                </text>,
              );
            }
            return <g key={r.id}>{nodes}</g>;
          })}
        </svg>
        {insight}
      </section>
      <section className="panel">
        <h3>Your 13-week tracker</h3>
        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>Week of</th>
                {cols.map(([h]) => (
                  <th className="num" key={h}>
                    {h}
                  </th>
                ))}
                <th>Felt</th>
                <th>What happened</th>
              </tr>
            </thead>
            <tbody>
              {[...rows].reverse().map((r) => {
                const ok = hasWeek(r.w);
                const c = r.w ? calc(r.w, S) : null;
                return (
                  <tr key={r.id} className={r.id === cur ? "cur" : ""}>
                    <td>
                      <a
                        className="wk"
                        href={`#week-${r.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          onGotoWeek(r.id);
                        }}
                      >
                        {shortLabel(r.id)}
                      </a>
                    </td>
                    {cols.map(([h, f]) => (
                      <td className="num" key={h}>
                        {ok && c && r.w ? f(c, r.w) : dash}
                      </td>
                    ))}
                    <td>{ok ? feelPill(r.w!.feel) : dash}</td>
                    <td>
                      {ok
                        ? r.w!.drove || dash
                        : (
                            <span className="muted">Not checked</span>
                          )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="msg">
          {m !== "personal"
            ? "✓ means the tax set-aside was moved to savings. "
            : ""}
          Tap a week to open it.
        </p>
      </section>
      {after}
      {promo}
      {!demo ? (
        <section className="panel">
          <h3>Your data</h3>
          <p className="msg">
            Your pulse checks are saved in this browser on this device. Download
            a copy now and then so you never lose them.
          </p>
          <div className="tools">
            <button
              type="button"
              className="btn small ghost"
              onClick={onExample}
            >
              Show the example
            </button>
            <button
              type="button"
              className="btn small ghost"
              onClick={onExport}
            >
              Download my tracker (CSV)
            </button>
            <button
              type="button"
              className="btn small ghost"
              onClick={onResetAsk}
            >
              Erase everything
            </button>
          </div>
          {toolMsg ? <p className="msg">{toolMsg}</p> : null}
          {resetAsk ? (
            <div className="confirm">
              This erases every week you&apos;ve entered and can&apos;t be
              undone.
              <div className="tools">
                <button
                  type="button"
                  className="btn small"
                  onClick={onResetYes}
                >
                  Erase it all
                </button>
                <button
                  type="button"
                  className="btn small ghost"
                  onClick={onResetNo}
                >
                  Keep my data
                </button>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}
    </>
  );
}
