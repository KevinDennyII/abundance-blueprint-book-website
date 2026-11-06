import type { ReactNode } from "react";
import { JOB_COSTS, calc, fmt, modeOf, sum } from "./math";
import type { PulseState, WeekData } from "./types";
import {
  DemoBanner,
  FeelChips,
  Line,
  ListEditor,
  MoneyInput,
  Nudges,
  PartHead,
  RulesBlock,
} from "./shared";

type Props = {
  S: PulseState;
  week: WeekData;
  demo: boolean;
  hasMine: boolean;
  onStartOwn: () => void;
  onGotIt: () => void;
  onPatchWeek: (patch: Partial<WeekData>) => void;
  onTaxRate: (v: string) => void;
  onNextMe: () => void;
};

export function BusinessPulse({
  S,
  week,
  demo,
  hasMine,
  onStartOwn,
  onGotIt,
  onPatchWeek,
  onTaxRate,
  onNextMe,
}: Props) {
  const m = modeOf(S);
  const c = calc(week, S);
  let n = 0;
  const next = () => ++n;

  const showRules = !demo && !S.settings.introSeen;
  const taxLine = JOB_COSTS ? 4 : 2;

  const bizNudges: ReactNode[] = [];
  if (c.tax > 0 && !week.moved) {
    bizNudges.push(
      <>
        Move <b>{fmt(c.tax)}</b> to your tax savings account, then check the box
        on line {taxLine}.
      </>,
    );
  }
  if (c.bp > 0) {
    bizNudges.push(
      <>
        You covered <b>{fmt(c.bp)}</b> of business costs personally. Keep the
        receipts, and pay these from the business next time.
      </>,
    );
  }

  return (
    <>
      {demo ? <DemoBanner hasMine={hasMine} onStart={onStartOwn} /> : null}
      {showRules ? <RulesBlock mode={m} onGotIt={onGotIt} /> : null}
      <PartHead eyebrow="Part one" title="The Business Pulse">
        Answer these before you think about your own bills. This is the
        business&apos;s turn.
      </PartHead>
      <section className="lines">
        <Line n={next()}>
          <label className="t" htmlFor="inc">
            Money that came in this week
          </label>
          <p className="hint">
            If fees or deductions came out before you got paid, like settlement
            deductions or platform and card fees, write the full amount before
            fees if you can find it. Money you never saw is still money your
            business earned.
          </p>
          <MoneyInput
            id="inc"
            value={week.inc}
            label="Money that came in"
            onChange={(v) => onPatchWeek({ inc: v })}
          />
        </Line>

        {JOB_COSTS ? (
          <>
            <Line n={next()}>
              <span className="t">What the work cost</span>
              <p className="hint">
                Money that went out to get this week&apos;s work done: people you
                paid to help, materials you used, platform or card fees.
              </p>
              <ListEditor
                items={week.jobCosts}
                placeholder="Helper, materials…"
                onChange={(jobCosts) => onPatchWeek({ jobCosts })}
              />
              <div className="total">
                <span>Total</span>
                <span>{fmt(sum(week.jobCosts))}</span>
              </div>
            </Line>
            <Line n={next()}>
              <span className="t">What the work made</span>
              <div
                className={
                  "result sm" +
                  (c.inc === 0 ? " empty" : c.made < 0 ? " neg" : "")
                }
              >
                <span className="v">{fmt(c.made)}</span>
                <span className="math">
                  {fmt(c.inc)} in − {fmt(c.jobs)} the work cost
                </span>
              </div>
            </Line>
          </>
        ) : null}

        <Line n={next()}>
          <span className="t">Tax set-aside</span>
          <div className="computed">
            <span className="v">{fmt(c.tax)}</span>
            <span className="rate">
              <label htmlFor="rate">
                {JOB_COSTS ? "of what the work made" : "of line 1"}, at
              </label>
              <input
                id="rate"
                inputMode="decimal"
                value={String(S.settings.taxRate)}
                onChange={(e) => onTaxRate(e.target.value)}
              />
              %
            </span>
          </div>
          <p className="hint">
            Nobody withholds taxes for you now, so you set them aside yourself,
            a little every week.
            {JOB_COSTS
              ? " You owe tax on what the work made, not on everything that came in."
              : ""}{" "}
            Why 30%? It&apos;s a safe starting point if you aren&apos;t keeping
            books yet. Once you are, a CPA can calculate your real rate.
          </p>
          <p className="hint">
            Want the full picture?{" "}
            <a
              href="/library"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "inherit" }}
            >
              <i>Your Business Is Not Your ATM</i>
            </a>{" "}
            walks you through why taxes work this way and how to find your real
            number.
          </p>
          <label className="check" htmlFor="moved">
            <input
              type="checkbox"
              id="moved"
              checked={week.moved}
              onChange={(e) => onPatchWeek({ moved: e.target.checked })}
            />
            Moved to my tax savings account
          </label>
        </Line>

        <Line n={next()}>
          <span className="t">Business bills due before my next pulse check</span>
          <ListEditor
            items={week.bills}
            placeholder="Booth rent, insurance…"
            onChange={(bills) => onPatchWeek({ bills })}
          />
          <div className="total">
            <span>Total</span>
            <span>{fmt(c.bills)}</span>
          </div>
        </Line>

        <Line n={next()}>
          <label className="t" htmlFor="sup">
            Set-aside for supplies and other business costs
          </label>
          <p className="hint">
            Gas, materials, inventory, fees: anything the business will spend
            before your next pulse check, even if it isn&apos;t a bill.
          </p>
          <MoneyInput
            id="sup"
            value={week.sup}
            label="Set-aside for supplies and other business costs"
            onChange={(v) => onPatchWeek({ sup: v })}
          />
        </Line>

        <Line n={next()}>
          <span className="t">What&apos;s left for the business</span>
          <div
            className={
              "result" + (c.inc === 0 ? " empty" : c.left < 0 ? " neg" : "")
            }
          >
            <span className="v">{fmt(c.left)}</span>
            <span className="math">
              {fmt(JOB_COSTS ? c.made : c.inc)} {JOB_COSTS ? "made" : "in"} −{" "}
              {fmt(c.tax)} tax − {fmt(c.bills)} bills − {fmt(c.sup)} set aside
            </span>
            <p>
              {c.inc === 0
                ? "Enter what came in on line 1 to see this."
                : c.left < 0
                  ? "This is negative. That's information, not failure. Seeing it early is the whole point."
                  : "This is what the business can afford to pay you, or keep as a cushion for a slow week."}
            </p>
          </div>
        </Line>

        <Line n={next()}>
          <span className="t">
            Business costs I paid from my personal account this week
          </span>
          <p className="hint">
            Supplies, uniforms, tools, fuel, your work phone. These are business
            expenses. Write them down so they aren&apos;t lost at tax time, and
            pay them from the business next time.
          </p>
          <ListEditor
            items={week.bizPersonal}
            placeholder="What I bought"
            onChange={(bizPersonal) => onPatchWeek({ bizPersonal })}
          />
        </Line>

        <Line n={next()}>
          <span className="t">This week felt</span>
          <FeelChips
            mode={m}
            feel={week.feel}
            drove={week.drove}
            onFeel={(feel) => onPatchWeek({ feel })}
            onDrove={(drove) => onPatchWeek({ drove })}
          />
        </Line>
      </section>
      <Nudges items={bizNudges} />
      <div className="cta">
        <button type="button" className="btn" onClick={onNextMe}>
          Next: your personal pulse →
        </button>
      </div>
    </>
  );
}
