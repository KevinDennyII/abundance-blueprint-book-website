import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { PageMeta } from "@/lib/seo";
import { BusinessPulse } from "./BusinessPulse";
import { MoneyMapSection } from "./MoneyMapSection";
import { PatternSection } from "./PatternSection";
import { PersonalPulse } from "./PersonalPulse";
import { loadDemoState } from "./demo";
import { downloadPulseCsv } from "./export-csv";
import {
  THIS_WEEK,
  addWeeks,
  anyData,
  blankWeek,
  freshState,
  modeOf,
  rangeLabel,
} from "./math";
import { ModeBar } from "./shared";
import { loadPulseState, savePulseState } from "./storage";
import type { MoneyMap, PulseMode, PulseState, TabId, WeekData } from "./types";
import "./Pulse.css";

const DISCLAIMER = {
  biz: "General financial education, not tax, legal, or accounting advice for your situation. Tax rates and rules vary by person, business structure, and state. For your specific numbers, work with a CPA or qualified tax professional.",
  personal:
    "General financial education, not financial, tax, or legal advice for your situation. If money stress is weighing on your health or relationships, a licensed counselor can help.",
};

function tabsFor(mode: Exclude<PulseMode, ""> | ""): [TabId, string, string][] {
  if (!mode) return [];
  if (mode === "full") {
    return [
      ["biz", "1", "Business"],
      ["me", "2", "You"],
      ["pat", "", "13 Weeks"],
    ];
  }
  if (mode === "personal") {
    return [
      ["me", "", "This week"],
      ["map", "", "Money Map"],
      ["pat", "", "13 Weeks"],
    ];
  }
  return [
    ["me", "", "This week"],
    ["pat", "", "13 Weeks"],
  ];
}

function initialBoot(): {
  S: PulseState;
  demo: boolean;
} {
  const { state, hadLocal } = loadPulseState();
  if (hadLocal) return { S: state, demo: false };
  return { S: loadDemoState(), demo: true };
}

/**
 * Unlisted Weekly Money Pulse tool — share URL only (Kit automation after signup).
 * Data stays on this device via localStorage; CSV export for backup.
 */
export default function Pulse() {
  const boot = useMemo(() => initialBoot(), []);
  const [S, setS] = useState<PulseState>(boot.S);
  const [demo, setDemo] = useState(boot.demo);
  const [mine, setMine] = useState<PulseState | null>(null);
  const [cur, setCur] = useState(THIS_WEEK);
  const [tab, setTab] = useState<TabId>(() => {
    const m = boot.S.settings.mode;
    if (m === "full" || boot.demo) return "biz";
    return "me";
  });
  const [resetAsk, setResetAsk] = useState(false);
  const [toolMsg, setToolMsg] = useState("");
  const [saveLabel] = useState("Saved on this device");

  const needsSetup = !demo && !S.settings.mode;
  const mode = S.settings.mode ? modeOf(S) : "";
  const tabs = tabsFor(mode);

  useEffect(() => {
    if (tabs.length && !tabs.some((t) => t[0] === tab)) {
      setTab(tabs[0][0]);
    }
  }, [tabs, tab]);

  useEffect(() => {
    if (demo) return;
    savePulseState(S);
  }, [S, demo]);

  const persist = useCallback((updater: (prev: PulseState) => PulseState) => {
    setS((prev) => updater(structuredClone(prev)));
  }, []);

  const week: WeekData = S.weeks[cur] ?? blankWeek();

  const patchWeek = (patch: Partial<WeekData>) => {
    persist((prev) => {
      const w = { ...(prev.weeks[cur] ?? blankWeek()), ...patch };
      return { ...prev, weeks: { ...prev.weeks, [cur]: w } };
    });
  };

  const startOwn = () => {
    const next = anyData(mine) && mine ? mine : freshState();
    setMine(null);
    setDemo(false);
    setS(next);
    setCur(THIS_WEEK);
    setTab(next.settings.mode === "full" || !next.settings.mode ? "biz" : "me");
    window.scrollTo({ top: 0 });
  };

  const setMode = (v: Exclude<PulseMode, "">) => {
    if (demo) {
      const next = anyData(mine) && mine ? mine : freshState();
      setMine(null);
      setDemo(false);
      setS({
        ...next,
        settings: { ...next.settings, mode: v },
      });
      setCur(THIS_WEEK);
      setTab(v === "full" ? "biz" : "me");
      window.scrollTo({ top: 0 });
      return;
    }
    persist((prev) => {
      const first = !prev.settings.mode || !anyData(prev);
      if (first) setTab(v === "full" ? "biz" : "me");
      return {
        ...prev,
        settings: { ...prev.settings, mode: v },
      };
    });
  };

  const goTab = (v: TabId) => {
    setTab(v);
    setResetAsk(false);
    setToolMsg("");
    window.scrollTo({ top: 0 });
  };

  const disclaimer =
    !needsSetup && mode === "personal" ? DISCLAIMER.personal : DISCLAIMER.biz;

  return (
    <div className="pulse-root">
      <PageMeta
        path="/pulse"
        title="The Weekly Money Pulse | Long Money Concepts"
        description="A simple weekly money check-in for business owners and households — track income, tax set-asides, and your 13-week pattern."
        noindex
      />

      <header className="band">
        <div className="wrap">
          <div className="brandrow">
            <span className="eyebrow">
              Long Money Concepts · Weekly Money Pulse
            </span>
            <span className="save">{demo ? "Example — not saved" : saveLabel}</span>
          </div>
          <div className="weekrow">
            <button
              type="button"
              className="arrow"
              aria-label="Previous week"
              onClick={() => setCur(addWeeks(cur, -1))}
            >
              ‹
            </button>
            <h1>
              <small>{cur === THIS_WEEK ? "This week" : "Week of"}</small>
              {rangeLabel(cur)}
            </h1>
            <button
              type="button"
              className="arrow"
              aria-label="Next week"
              disabled={cur >= THIS_WEEK}
              onClick={() => {
                if (cur < THIS_WEEK) setCur(addWeeks(cur, 1));
              }}
            >
              ›
            </button>
          </div>
          {!needsSetup ? (
            <nav
              className={"tabs" + (tabs.length === 2 ? " two" : "")}
              role="tablist"
            >
              {tabs.map(([v, num, l]) => (
                <button
                  key={v}
                  type="button"
                  className="tab"
                  role="tab"
                  aria-selected={v === tab}
                  onClick={() => goTab(v)}
                >
                  {num ? <span className="num">{num}</span> : null}
                  {l}
                </button>
              ))}
            </nav>
          ) : null}
        </div>
      </header>

      <main>
        <div className="wrap">
          {needsSetup ? (
            <Setup onMode={setMode} />
          ) : (
            <>
              <ModeBar demo={demo} mode={S.settings.mode} onMode={setMode} />
              {tab === "biz" ? (
                <BusinessPulse
                  S={S}
                  week={week}
                  demo={demo}
                  hasMine={anyData(mine)}
                  onStartOwn={startOwn}
                  onGotIt={() =>
                    persist((p) => ({
                      ...p,
                      settings: { ...p.settings, introSeen: true },
                    }))
                  }
                  onPatchWeek={patchWeek}
                  onTaxRate={(v) =>
                    persist((p) => ({
                      ...p,
                      settings: { ...p.settings, taxRate: v },
                    }))
                  }
                  onNextMe={() => goTab("me")}
                />
              ) : null}
              {tab === "me" ? (
                <PersonalPulse
                  S={S}
                  week={week}
                  cur={cur}
                  demo={demo}
                  hasMine={anyData(mine)}
                  onStartOwn={startOwn}
                  onGotIt={() =>
                    persist((p) => ({
                      ...p,
                      settings: { ...p.settings, introSeen: true },
                    }))
                  }
                  onPatchWeek={patchWeek}
                  onDone={() => patchWeek({ done: true })}
                  onSeePattern={() => goTab("pat")}
                  onGoBiz={() => goTab("biz")}
                  onGoMap={() => goTab("map")}
                />
              ) : null}
              {tab === "map" ? (
                <MoneyMapSection
                  S={S}
                  demo={demo}
                  hasMine={anyData(mine)}
                  onStartOwn={startOwn}
                  onPatchMap={(map: MoneyMap) =>
                    persist((p) => ({ ...p, map }))
                  }
                />
              ) : null}
              {tab === "pat" ? (
                <PatternSection
                  S={S}
                  cur={cur}
                  demo={demo}
                  hasMine={anyData(mine)}
                  resetAsk={resetAsk}
                  toolMsg={toolMsg}
                  onStartOwn={startOwn}
                  onGotoWeek={(id) => {
                    setCur(id);
                    setTab(mode === "full" ? "biz" : "me");
                    window.scrollTo({ top: 0 });
                  }}
                  onPatchSettings={(patch) =>
                    persist((p) => ({
                      ...p,
                      settings: { ...p.settings, ...patch },
                    }))
                  }
                  onMode={setMode}
                  onExample={() => {
                    setMine(S);
                    setS(loadDemoState());
                    setDemo(true);
                    setCur(THIS_WEEK);
                    setTab("biz");
                    setResetAsk(false);
                    setToolMsg("");
                    window.scrollTo({ top: 0 });
                  }}
                  onExport={() => setToolMsg(downloadPulseCsv(S))}
                  onResetAsk={() => setResetAsk(true)}
                  onResetNo={() => setResetAsk(false)}
                  onResetYes={() => {
                    setS(freshState());
                    setResetAsk(false);
                    setToolMsg("");
                    setCur(THIS_WEEK);
                  }}
                />
              ) : null}
            </>
          )}
        </div>
      </main>

      <footer>
        <div className="wrap">
          <span className="tag">There&apos;s life beneath the numbers.</span>
          <span>{disclaimer}</span>
          <span>
            © {new Date().getFullYear()} Long Money Concepts LLC ·{" "}
            <Link href="/">longmoneyconcepts.com</Link>
            {" · "}
            <Link href="/library">Library</Link>
          </span>
        </div>
      </footer>
    </div>
  );
}

function Setup({
  onMode,
}: {
  onMode: (m: Exclude<PulseMode, "">) => void;
}) {
  const choices: [Exclude<PulseMode, "">, string, string][] = [
    [
      "full",
      "I run a business and don't keep books",
      "Money comes in from customers or clients, and nobody tracks it but you. You'll check the business first, then yourself.",
    ],
    [
      "books",
      "I keep my business books somewhere else",
      "Your bookkeeping already tracks the business. You'll check your tax set-aside and your personal money.",
    ],
    [
      "personal",
      "I don't have a business",
      "Paychecks, benefits, side income. You'll check what came in, what's already spoken for, and what's left.",
    ],
  ];
  return (
    <>
      <div className="part-head">
        <span className="eyebrow">Let&apos;s set you up</span>
        <h2>How does money come to you?</h2>
        <p>Pick the one that fits. You can change it later.</p>
      </div>
      <div className="choices">
        {choices.map(([k, t, d]) => (
          <button
            key={k}
            type="button"
            className="choice"
            onClick={() => onMode(k)}
          >
            <b>{t}</b>
            <span>{d}</span>
          </button>
        ))}
      </div>
    </>
  );
}
