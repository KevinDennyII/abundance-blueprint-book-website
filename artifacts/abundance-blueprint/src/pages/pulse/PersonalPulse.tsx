import type { ReactNode } from "react";
import { calc, fmt, modeOf, rangeLabel, weeklySetAside } from "./math";
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
  cur: string;
  demo: boolean;
  hasMine: boolean;
  onStartOwn: () => void;
  onGotIt: () => void;
  onPatchWeek: (patch: Partial<WeekData>) => void;
  onDone: () => void;
  onSeePattern: () => void;
  onGoBiz: () => void;
  onGoMap: () => void;
};

export function PersonalPulse({
  S,
  week,
  cur,
  demo,
  hasMine,
  onStartOwn,
  onGotIt,
  onPatchWeek,
  onDone,
  onSeePattern,
  onGoBiz,
  onGoMap,
}: Props) {
  const m = modeOf(S);
  const c = calc(week, S);
  const wk = weeklySetAside(S);
  let n = 0;
  const next = () => ++n;

  const showRules =
    !demo && !S.settings.introSeen && (m === "personal" || m === "books");

  const firstNudges: ReactNode[] = [];
  if (m === "full" && String(week.inc).trim() === "") {
    firstNudges.push(
      <>
        <b>Business first, then you.</b>{" "}
        <button
          type="button"
          onClick={onGoBiz}
          style={{
            background: "none",
            border: 0,
            padding: 0,
            color: "inherit",
            textDecoration: "underline",
            font: "inherit",
            cursor: "pointer",
          }}
        >
          Do the Business Pulse
        </button>{" "}
        before this page.
      </>,
    );
  }

  const meNudges: ReactNode[] = [];
  if (
    m === "full" &&
    c.inc > 0 &&
    c.paid > 0 &&
    c.paid > Math.max(c.left, 0)
  ) {
    meNudges.push(
      <>
        You paid yourself <b>{fmt(c.paid - Math.max(c.left, 0))}</b> more than
        the business had left this week. Busy weeks have to carry the slow ones,
        so watch this in your 13-week tracker.
      </>,
    );
  }
  if (m === "books" && !week.moved) {
    meNudges.push(
      <>
        Your bookkeeping can tell you what you made. Only you can move the tax
        money. Check the box once this week&apos;s set-aside is in savings.
      </>,
    );
  }
  if (m !== "personal" && c.pbiz > 0) {
    meNudges.push(
      <>
        <b>{fmt(c.pbiz)}</b> of personal costs came from the business account.
        That&apos;s still you getting paid. Next time, pay yourself first and
        pay these from your personal account.
      </>,
    );
  }
  if (m === "personal" && c.surp > 0) {
    meNudges.push(
      <>
        Surprises this week: <b>{fmt(c.surp)}</b>. If any of these come around
        every year, add them to your{" "}
        <button
          type="button"
          onClick={onGoMap}
          style={{
            background: "none",
            border: 0,
            padding: 0,
            color: "inherit",
            textDecoration: "underline",
            font: "inherit",
            cursor: "pointer",
          }}
        >
          Money Map
        </button>{" "}
        so next time they&apos;re planned.
      </>,
    );
  }

  const emptyP = c.paid === 0 && c.other === 0 && c.pb === 0;

  const doneBar = week.done ? (
    <div className="donebar">
      <span>
        ✓ Pulse checked for the week of {rangeLabel(cur)}
        <br />
        <small style={{ fontWeight: 400 }}>
          Need to fix something? Change any number above. It saves on its own,
          and your 13 weeks update.
        </small>
      </span>
      <button type="button" className="btn small ghost" onClick={onSeePattern}>
        See my 13 weeks
      </button>
    </div>
  ) : (
    <div className="cta">
      <button type="button" className="btn" onClick={onDone}>
        I checked my pulse ✓
      </button>
    </div>
  );

  if (m === "personal") {
    return (
      <>
        {demo ? <DemoBanner hasMine={hasMine} onStart={onStartOwn} /> : null}
        {showRules ? <RulesBlock mode={m} onGotIt={onGotIt} /> : null}
        <PartHead eyebrow="Your weekly check" title="Your Personal Pulse">
          Ten minutes, once a week. Answer what you can. A blank is okay.
        </PartHead>
        <section className="lines">
          <Line n={next()}>
            <label className="t" htmlFor="paid">
              Money that came in this week
            </label>
            <p className="hint">
              Paychecks, benefits, child support, side income, a partner&apos;s
              pay. Anything coming into the household.
            </p>
            <MoneyInput
              id="paid"
              value={week.paid}
              label="Money that came in"
              onChange={(v) => onPatchWeek({ paid: v })}
            />
          </Line>
          <Line n={next()}>
            <span className="t">Bills due before my next pulse check</span>
            <ListEditor
              items={week.pbills}
              placeholder="Rent, car note, phone…"
              onChange={(pbills) => onPatchWeek({ pbills })}
            />
            <div className="total">
              <span>Total</span>
              <span>{fmt(c.pb)}</span>
            </div>
          </Line>
          <Line n={next()}>
            <span className="t">Left for everyday living</span>
            <div
              className={
                "result" + (emptyP ? " empty" : c.living < 0 ? " neg" : "")
              }
            >
              <span className="v">{fmt(c.living)}</span>
              <span className="math">
                {fmt(c.paid)} came in − {fmt(c.pb)} bills
              </span>
              <p>
                {emptyP
                  ? "Fill in the lines above to see this."
                  : c.living < 0
                    ? "Your bills are more than what's coming in before your next check. That's information, not failure. Call your billers about moving due dates."
                    : "This is what you have for everyday living until your next pulse check."}
              </p>
            </div>
            {wk > 0 ? (
              <p className="hint">
                Your Money Map says to set aside {fmt(wk)} a week for costs that
                come once or twice a year.
              </p>
            ) : null}
          </Line>
          <Line n={next()}>
            <span className="t">Surprises this week</span>
            <p className="hint">
              A car repair, a school fee, a gift you didn&apos;t plan for. Write
              them down. Surprises that keep coming back aren&apos;t really
              surprises, and you can plan for them.
            </p>
            <ListEditor
              items={week.surprises}
              placeholder="What came up"
              onChange={(surprises) => onPatchWeek({ surprises })}
            />
            <div className="total">
              <span>Total</span>
              <span>{fmt(c.surp)}</span>
            </div>
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
          <Line n={next()}>
            <label className="t" htmlFor="noticed">
              One thing I noticed this week
            </label>
            <textarea
              id="noticed"
              rows={3}
              placeholder="Write it while it's fresh."
              value={week.noticed}
              onChange={(e) => onPatchWeek({ noticed: e.target.value })}
            />
          </Line>
        </section>
        <Nudges items={meNudges} />
        {doneBar}
      </>
    );
  }

  const head =
    m === "full" ? (
      <PartHead eyebrow="Part two" title="Your Personal Pulse">
        Now it&apos;s your turn. Your personal money should come from what the
        business paid you, not from reaching into the business account.
      </PartHead>
    ) : (
      <PartHead eyebrow="Your weekly check" title="Your Personal Pulse">
        Your books track the business. This is your side of the money, plus the
        one business habit people skip.
      </PartHead>
    );

  return (
    <>
      {demo ? <DemoBanner hasMine={hasMine} onStart={onStartOwn} /> : null}
      {showRules ? <RulesBlock mode={m} onGotIt={onGotIt} /> : null}
      {head}
      <Nudges items={firstNudges} />
      <section className="lines">
        {m === "books" ? (
          <Line n={next()}>
            <span className="t">Tax set-aside</span>
            <p className="hint">
              Bookkeeping tracks what you made. It doesn&apos;t move the tax
              money for you. Did this week&apos;s set-aside go to savings?
            </p>
            <label className="check" htmlFor="moved">
              <input
                type="checkbox"
                id="moved"
                checked={week.moved}
                onChange={(e) => onPatchWeek({ moved: e.target.checked })}
              />
              I moved my tax set-aside to savings
            </label>
            <MoneyInput
              id="taxAmt"
              value={week.taxAmt}
              label="Amount I moved"
              onChange={(v) => onPatchWeek({ taxAmt: v })}
            />
          </Line>
        ) : null}

        <Line n={next()}>
          <label className="t" htmlFor="paid">
            What I paid myself from the business this week
          </label>
          {m === "full" ? (
            <p className="hint">
              {c.inc > 0
                ? `After taxes, bills and set-asides, the business had ${fmt(c.left)} left this week.`
                : "Fill in the Business Pulse first so you know what the business can afford."}
            </p>
          ) : null}
          <MoneyInput
            id="paid"
            value={week.paid}
            label="What I paid myself"
            onChange={(v) => onPatchWeek({ paid: v })}
          />
          <div className="chips">
            {(
              [
                ["set", "A set amount I planned"],
                ["whatever", "Whatever I needed at the moment"],
              ] as const
            ).map(([v, l]) => (
              <button
                key={v}
                type="button"
                className="chip"
                aria-pressed={week.payType === v}
                onClick={() =>
                  onPatchWeek({ payType: week.payType === v ? "" : v })
                }
              >
                {l}
              </button>
            ))}
          </div>
        </Line>

        <Line n={next()}>
          <label className="t" htmlFor="other">
            Other household income this week
          </label>
          <p className="hint">
            A partner&apos;s paycheck, a second job, anything else coming into
            the household.
          </p>
          <MoneyInput
            id="other"
            value={week.other}
            label="Other household income"
            onChange={(v) => onPatchWeek({ other: v })}
          />
        </Line>

        <Line n={next()}>
          <span className="t">Personal bills due before my next pulse check</span>
          <ListEditor
            items={week.pbills}
            placeholder="Rent, car note, phone…"
            onChange={(pbills) => onPatchWeek({ pbills })}
          />
          <div className="total">
            <span>Total</span>
            <span>{fmt(c.pb)}</span>
          </div>
        </Line>

        <Line n={next()}>
          <span className="t">Left for everyday living</span>
          <div
            className={
              "result" + (emptyP ? " empty" : c.living < 0 ? " neg" : "")
            }
          >
            <span className="v">{fmt(c.living)}</span>
            <span className="math">
              {fmt(c.paid)} paid myself + {fmt(c.other)} other − {fmt(c.pb)}{" "}
              bills
            </span>
            <p>
              {emptyP
                ? "Fill in the lines above to see this."
                : c.living < 0
                  ? "Your bills are more than what's coming in before your next check. That's information, not failure. Call your billers about moving due dates."
                  : "This is what you have for everyday living until your next pulse check."}
            </p>
          </div>
        </Line>

        <Line n={next()}>
          <span className="t">
            Personal costs I paid from the business account this week
          </span>
          <p className="hint">
            Rent or mortgage, groceries, a personal bill. These are personal
            expenses. Even if you&apos;re not on payroll, this is still you
            getting paid. Write them down, and next time, pay yourself first and
            pay these from your personal account.
          </p>
          <ListEditor
            items={week.persBiz}
            placeholder="What it was"
            onChange={(persBiz) => onPatchWeek({ persBiz })}
          />
        </Line>

        {m === "books" ? (
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
        ) : null}

        <Line n={next()}>
          <label className="t" htmlFor="noticed">
            One thing I noticed this week
          </label>
          <textarea
            id="noticed"
            rows={3}
            placeholder="Write it while it's fresh."
            value={week.noticed}
            onChange={(e) => onPatchWeek({ noticed: e.target.value })}
          />
        </Line>
      </section>
      <Nudges items={meNudges} />
      {doneBar}
    </>
  );
}
