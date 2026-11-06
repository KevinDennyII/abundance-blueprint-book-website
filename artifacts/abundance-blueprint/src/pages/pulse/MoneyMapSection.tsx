import type { ReactNode } from "react";
import { fmt, n, r2, sum, weeklySetAside } from "./math";
import type { MoneyMap, PulseState } from "./types";
import { DemoBanner, Nudges } from "./shared";

type Props = {
  S: PulseState;
  demo: boolean;
  hasMine: boolean;
  onStartOwn: () => void;
  onPatchMap: (map: MoneyMap) => void;
};

export function MoneyMapSection({
  S,
  demo,
  hasMine,
  onStartOwn,
  onPatchMap,
}: Props) {
  const M = S.map;
  const tips: ReactNode[] = [];
  let maxShare = 0;
  let total = 0;
  (M.checks || []).forEach((c) => {
    const b = sum(c.bills);
    total += b;
    maxShare = Math.max(maxShare, b);
  });
  if ((M.checks || []).length > 1 && total > 0 && maxShare / total > 0.6) {
    tips.push(
      "One paycheck is carrying most of your bills. Call and ask to move a due date. A phone call beats a late fee.",
    );
  }

  const setChecks = (checks: MoneyMap["checks"]) =>
    onPatchMap({ ...M, checks });
  const setYearly = (yearly: MoneyMap["yearly"]) =>
    onPatchMap({ ...M, yearly });

  return (
    <>
      {demo ? <DemoBanner hasMine={hasMine} onStart={onStartOwn} /> : null}
      <div className="part-head">
        <span className="eyebrow">Your money map</span>
        <h2>Map Your Month</h2>
        <p>Fill this in once. Update it when a paycheck or a bill changes.</p>
      </div>
      <section className="panel">
        <h3>When money comes in, and what it has to cover</h3>
        <p className="msg">
          Add each paycheck for one month and the bills that paycheck pays.
        </p>
        {(M.checks || []).map((c, ci) => (
          <div className="paycheck" key={ci}>
            <div className="top">
              <input
                placeholder={`Paycheck ${ci + 1} date, like the 1st`}
                value={c.date}
                aria-label={`Paycheck ${ci + 1} date`}
                onChange={(e) => {
                  const checks = M.checks.slice();
                  checks[ci] = { ...checks[ci], date: e.target.value };
                  setChecks(checks);
                }}
              />
              <input
                className="amt"
                inputMode="decimal"
                placeholder="$ amount"
                value={c.amt}
                aria-label={`Paycheck ${ci + 1} amount`}
                onChange={(e) => {
                  const checks = M.checks.slice();
                  checks[ci] = { ...checks[ci], amt: e.target.value };
                  setChecks(checks);
                }}
              />
              <button
                type="button"
                className="x"
                aria-label="Remove paycheck"
                onClick={() => setChecks(M.checks.filter((_, j) => j !== ci))}
              >
                ×
              </button>
            </div>
            {(c.bills || []).length ? (
              <div className="colhead">
                <span>Bills it covers</span>
                <span>Due</span>
                <span style={{ textAlign: "right" }}>Amount</span>
                <span />
              </div>
            ) : null}
            <div className="list">
              {(c.bills || []).map((b, bi) => (
                <div className="row bill" key={bi}>
                  <input
                    placeholder="Bill"
                    value={b.name}
                    aria-label="Bill"
                    onChange={(e) => {
                      const checks = M.checks.slice();
                      const bills = (checks[ci].bills || []).slice();
                      bills[bi] = { ...bills[bi], name: e.target.value };
                      checks[ci] = { ...checks[ci], bills };
                      setChecks(checks);
                    }}
                  />
                  <input
                    placeholder="Due"
                    value={b.due}
                    aria-label="Due date"
                    onChange={(e) => {
                      const checks = M.checks.slice();
                      const bills = (checks[ci].bills || []).slice();
                      bills[bi] = { ...bills[bi], due: e.target.value };
                      checks[ci] = { ...checks[ci], bills };
                      setChecks(checks);
                    }}
                  />
                  <input
                    className="amt"
                    inputMode="decimal"
                    placeholder="$0"
                    value={b.amt}
                    aria-label="Amount"
                    onChange={(e) => {
                      const checks = M.checks.slice();
                      const bills = (checks[ci].bills || []).slice();
                      bills[bi] = { ...bills[bi], amt: e.target.value };
                      checks[ci] = { ...checks[ci], bills };
                      setChecks(checks);
                    }}
                  />
                  <button
                    type="button"
                    className="x"
                    aria-label="Remove bill"
                    onClick={() => {
                      const checks = M.checks.slice();
                      checks[ci] = {
                        ...checks[ci],
                        bills: (checks[ci].bills || []).filter(
                          (_, j) => j !== bi,
                        ),
                      };
                      setChecks(checks);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="add"
                onClick={() => {
                  const checks = M.checks.slice();
                  checks[ci] = {
                    ...checks[ci],
                    bills: [
                      ...(checks[ci].bills || []),
                      { name: "", due: "", amt: "" },
                    ],
                  };
                  setChecks(checks);
                }}
              >
                + Add a bill
              </button>
            </div>
            <div className="total">
              <span>Left after bills</span>
              <span>{fmt(r2(n(c.amt) - sum(c.bills)))}</span>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="add"
          onClick={() =>
            setChecks([...M.checks, { date: "", amt: "", bills: [] }])
          }
        >
          + Add a paycheck
        </button>
        <Nudges items={tips} />
      </section>
      <section className="panel">
        <h3>The not-so-surprising list</h3>
        <p className="msg">
          Costs that come once or twice a year: car registration, insurance,
          back-to-school, birthdays, the holidays. A little each week is the
          yearly cost divided by 52. Holiday gifts at $520 a year is $10 a week.
        </p>
        <div className="yearlist">
          {(M.yearly || []).map((y, i) => (
            <div className="row yearly" key={i}>
              <input
                className="nm"
                placeholder="Expense"
                value={y.name}
                aria-label="Expense"
                onChange={(e) => {
                  const yearly = M.yearly.slice();
                  yearly[i] = { ...yearly[i], name: e.target.value };
                  setYearly(yearly);
                }}
              />
              <input
                className="wh"
                placeholder="When it comes"
                value={y.when}
                aria-label="When it comes"
                onChange={(e) => {
                  const yearly = M.yearly.slice();
                  yearly[i] = { ...yearly[i], when: e.target.value };
                  setYearly(yearly);
                }}
              />
              <input
                className="am amt"
                inputMode="decimal"
                placeholder="$ a year"
                value={y.amt}
                aria-label="Yearly cost"
                onChange={(e) => {
                  const yearly = M.yearly.slice();
                  yearly[i] = { ...yearly[i], amt: e.target.value };
                  setYearly(yearly);
                }}
              />
              <button
                type="button"
                className="x"
                aria-label="Remove"
                onClick={() => setYearly(M.yearly.filter((_, j) => j !== i))}
              >
                ×
              </button>
              <span className="wk">
                {n(y.amt)
                  ? `${fmt(n(y.amt))} ÷ 52 = ${fmt(r2(n(y.amt) / 52))} a week`
                  : ""}
              </span>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="add"
          onClick={() =>
            setYearly([...M.yearly, { name: "", when: "", amt: "" }])
          }
        >
          + Add an expense
        </button>
        <div className="total">
          <span>My weekly set-aside</span>
          <span>{fmt(weeklySetAside(S))}</span>
        </div>
      </section>
      <section className="guide">
        <span className="eyebrow">Coming soon</span>
        <h3>The Financial Foundations Workshop</h3>
        <p>
          Want help building a plan around your map? The workshop, coming soon
          to the Long Money Library, walks you through it step by step.
        </p>
      </section>
    </>
  );
}
