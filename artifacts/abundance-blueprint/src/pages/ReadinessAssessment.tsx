import {
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Link, useSearch } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageMeta } from "@/lib/seo";
import { submitKitForm } from "@/lib/kit-form";
import {
  CRISIS_RESOURCE_GUIDE_URL,
  CRISIS_STABILIZATION_ROADMAP_URL,
  DISCOVERY_CALL_URL,
} from "@/lib/social";

type QuizSource = "reset" | "advisory";

type Option = {
  label: string;
  points: number | null;
  crisis?: boolean;
};

type Question = {
  text: string;
  options: Option[];
  isCrisisCheck?: boolean;
};

type ResultKey = "green" | "yellow" | "red";

type ResultData = {
  color: string;
  label: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  ctaExternal: boolean;
  secondaryLabel: string;
  secondaryHref: string;
  secondaryExternal: boolean;
  tag: string;
};

const QUESTIONS: Question[] = [
  {
    text: "How would you describe your relationship with checking your bank balance?",
    options: [
      { label: "I check often and generally know where I stand", points: 3 },
      {
        label: "I check sometimes, but I avoid it when I'm stressed",
        points: 2,
      },
      { label: "I avoid looking most of the time", points: 1 },
    ],
  },
  {
    text: "When an unexpected expense comes up, what usually happens?",
    options: [
      { label: "I have something set aside for it", points: 3 },
      {
        label: "I can usually cover it, but it sets me back",
        points: 2,
      },
      {
        label:
          "It creates a real problem — I have to borrow, skip something else, or fall behind",
        points: 1,
      },
    ],
  },
  {
    text: "How well do you know where your money goes each month?",
    options: [
      { label: "I have a clear picture", points: 3 },
      {
        label: "I have a general sense, but there are gaps",
        points: 2,
      },
      { label: "Honestly, not very well", points: 1 },
    ],
  },
  {
    text: "Do you have a habit of setting money aside, even a small amount, on a regular basis?",
    options: [
      { label: "Yes, consistently", points: 3 },
      {
        label: "Sometimes, when I remember or can afford it",
        points: 2,
      },
      { label: "Not currently", points: 1 },
    ],
  },
  {
    text: "When you picture your financial life a year from now, how do you feel?",
    options: [
      { label: "Hopeful and motivated", points: 3 },
      { label: "Uncertain, but open to change", points: 2 },
      { label: "Anxious or overwhelmed", points: 1 },
    ],
  },
  {
    text: "Is there anything urgent right now — a shutoff notice, risk of eviction, an account in collections, or something similar — that needs immediate attention?",
    isCrisisCheck: true,
    options: [
      { label: "No", points: null, crisis: false },
      { label: "Yes", points: null, crisis: true },
    ],
  },
];

const RESULTS: Record<ResultKey, ResultData> = {
  green: {
    color: "#5C7A5C",
    label: "Your result",
    title: "You're ready to build",
    body: "You've got real awareness and some systems already working for you. What you're likely missing isn't information — it's a structured plan and support to carry it through. This is exactly what the Financial Wellness Reset is built for.",
    ctaLabel: "Book a discovery call",
    ctaHref: DISCOVERY_CALL_URL,
    ctaExternal: true,
    secondaryLabel:
      "Not ready for 1:1 support yet? Join the Long Money Circle, free.",
    secondaryHref: "/circle",
    secondaryExternal: false,
    tag: "readiness-green",
  },
  yellow: {
    color: "#B8912E",
    label: "Your result",
    title: "You're building your foundation",
    body: "You're already paying attention, and that matters. Right now, the most useful next step is building consistency and closing a few knowledge gaps before jumping into a bigger commitment.",
    ctaLabel: "Join the Long Money Circle",
    ctaHref: "/circle",
    ctaExternal: false,
    secondaryLabel: "Browse services and guides",
    secondaryHref: "/work-with-me",
    secondaryExternal: false,
    tag: "readiness-yellow",
  },
  red: {
    color: "#8C4A3D",
    label: "Your result",
    title: "Let's get you stable first",
    body: "If something urgent is going on, that comes first — always. This isn't about being “behind.” It's about getting steady ground under you before anything else. Here's a free guide to help you find your next step.",
    ctaLabel: "Download the Crisis Stabilization Roadmap",
    ctaHref: CRISIS_STABILIZATION_ROADMAP_URL,
    ctaExternal: true,
    secondaryLabel: "Also get the Resource Guide",
    secondaryHref: CRISIS_RESOURCE_GUIDE_URL,
    secondaryExternal: true,
    tag: "readiness-red",
  },
};

const GREEN_OVERRIDES_BY_SOURCE: Record<
  QuizSource,
  Partial<ResultData>
> = {
  reset: {
    title: "You're ready to build",
    body: "You've got real awareness and some systems already working for you. What you're likely missing isn't information — it's a structured plan and support to carry it through. This is exactly what the Financial Wellness Reset is built for.",
    ctaLabel: "Book a discovery call",
    ctaHref: DISCOVERY_CALL_URL,
    ctaExternal: true,
    tag: "readiness-green-reset",
  },
  advisory: {
    title: "Sounds like you're ready",
    body: "Based on your answers, you're in a solid place to make the most of ongoing 1:1 support. If you've already completed the Financial Wellness Reset (or have equivalent foundational work in place), let's get a discovery call on the calendar.",
    ctaLabel: "Book a discovery call",
    ctaHref: DISCOVERY_CALL_URL,
    ctaExternal: true,
    tag: "readiness-green-advisory",
  },
};

function getSource(search: string): QuizSource {
  const params = new URLSearchParams(
    search.startsWith("?") ? search.slice(1) : search,
  );
  return params.get("source") === "advisory" ? "advisory" : "reset";
}

function computeResult(selections: Array<number | null>): ResultKey {
  const crisisQ = QUESTIONS.findIndex((q) => q.isCrisisCheck);
  const crisisAnswerIndex = selections[crisisQ];
  if (
    crisisAnswerIndex !== null &&
    QUESTIONS[crisisQ].options[crisisAnswerIndex]?.crisis === true
  ) {
    return "red";
  }

  let score = 0;
  QUESTIONS.forEach((q, i) => {
    if (q.isCrisisCheck) return;
    const selected = selections[i];
    if (selected === null) return;
    const points = q.options[selected]?.points;
    if (typeof points === "number") score += points;
  });

  if (score >= 12) return "green";
  if (score >= 8) return "yellow";
  return "red";
}

function getResultData(key: ResultKey, source: QuizSource): ResultData {
  const base = RESULTS[key];
  if (key === "green") {
    return { ...base, ...GREEN_OVERRIDES_BY_SOURCE[source] };
  }
  return base;
}

function ResultLink({
  href,
  external,
  className,
  style,
  children,
}: {
  href: string;
  external: boolean;
  className: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={style}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} style={style}>
      {children}
    </Link>
  );
}

type Step = "quiz" | "email" | "result";

export default function ReadinessAssessment() {
  const search = useSearch();
  const source = useMemo(() => getSource(search), [search]);

  const [step, setStep] = useState<Step>("quiz");
  const [current, setCurrent] = useState(0);
  const [selections, setSelections] = useState<Array<number | null>>(
    () => new Array(QUESTIONS.length).fill(null),
  );
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [resultKey, setResultKey] = useState<ResultKey | null>(null);

  const emailValid = /\S+@\S+\.\S+/.test(email);
  const canSubmitEmail = firstName.trim().length > 0 && emailValid;

  const introText =
    source === "advisory"
      ? "Advisory Membership works best once foundational work is already in place. This quick check helps confirm that before we get a discovery call on the calendar."
      : "Money is never just math — there's a story beneath the numbers for all of us. This quick check isn't a test. It's a starting point, so you know exactly where to begin.";

  const question = QUESTIONS[current];
  const result = resultKey ? getResultData(resultKey, source) : null;

  const handleContinue = () => {
    if (selections[current] === null) return;
    if (current < QUESTIONS.length - 1) {
      setCurrent((c) => c + 1);
      return;
    }
    setStep("email");
  };

  const handleSubmit = async () => {
    if (!canSubmitEmail || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);

    const key = computeResult(selections);
    const data = getResultData(key, source);

    // Best-effort lead capture on the Circle Kit form; always show the result
    // so booking CTAs stay reachable (trademark specimen + visitor UX).
    const kitResult = await submitKitForm(email.trim(), "circle", {
      firstName: firstName.trim(),
      tag: data.tag,
    });

    setIsSubmitting(false);

    if (!kitResult.ok) {
      setSubmitError(kitResult.error);
    }

    setResultKey(key);
    setStep("result");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PageMeta path="/readiness-assessment" />
      <Navbar />

      <main className="flex-1 pt-24">
        <div className="max-w-xl mx-auto px-4 md:px-6 py-14 md:py-16">
          <header className="text-center mb-10">
            <div
              className="mx-auto mb-5 h-0.5 w-7 bg-secondary"
              aria-hidden="true"
            />
            <h1 className="font-serif text-3xl md:text-4xl text-primary mb-3.5">
              Where are you starting from?
            </h1>
            <p className="text-muted text-lg leading-relaxed max-w-md mx-auto">
              {introText}
            </p>
          </header>

          {step === "quiz" ? (
            <>
              <div
                className="flex items-center justify-center gap-2.5 mb-8"
                aria-hidden="true"
              >
                {QUESTIONS.map((_, i) => (
                  <span
                    key={i}
                    className={`size-2.5 rounded-full border-[1.5px] border-primary transition-all ${
                      i < current
                        ? "bg-secondary border-secondary opacity-100"
                        : i === current
                          ? "bg-primary opacity-100 scale-[1.3]"
                          : "opacity-35"
                    }`}
                  />
                ))}
              </div>

              <div className="bg-white border-t-[3px] border-secondary px-7 py-9 md:px-9 shadow-sm">
                <p className="font-serif text-xl md:text-2xl text-primary mb-6 max-w-sm">
                  {question.text}
                </p>
                <div className="flex flex-col gap-2.5 mb-7">
                  {question.options.map((opt, i) => {
                    const selected = selections[current] === i;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        className={`text-left font-sans px-4 py-3.5 border-[1.5px] transition-colors ${
                          selected
                            ? "border-primary bg-primary/5"
                            : "border-border bg-background hover:border-secondary"
                        }`}
                        onClick={() =>
                          setSelections((prev) => {
                            const next = [...prev];
                            next[current] = i;
                            return next;
                          })
                        }
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    className="font-sans text-sm text-muted px-2 py-3 hover:text-foreground transition-colors"
                    style={{
                      visibility: current === 0 ? "hidden" : "visible",
                    }}
                    onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={selections[current] === null}
                    className="font-sans text-sm px-5 py-3 bg-primary text-primary-foreground disabled:opacity-35 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                    onClick={handleContinue}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </>
          ) : null}

          {step === "email" ? (
            <div className="bg-white border-t-[3px] border-secondary px-7 py-9 md:px-9 shadow-sm">
              <p className="font-serif text-xl md:text-2xl text-primary mb-2">
                Enter your email to see your result
              </p>
              <p className="text-muted mb-6">
                You&apos;ll also get one free resource matched to where
                you&apos;re starting from.
              </p>
              <div className="flex flex-col gap-1.5 mb-4">
                <label
                  htmlFor="readiness-first-name"
                  className="font-sans text-sm text-muted"
                >
                  First name
                </label>
                <input
                  id="readiness-first-name"
                  type="text"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="font-serif text-base px-3.5 py-3 border-[1.5px] border-border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5 mb-6">
                <label
                  htmlFor="readiness-email"
                  className="font-sans text-sm text-muted"
                >
                  Email
                </label>
                <input
                  id="readiness-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="font-serif text-base px-3.5 py-3 border-[1.5px] border-border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="font-sans text-sm text-muted px-2 py-3 hover:text-foreground transition-colors"
                  onClick={() => setStep("quiz")}
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!canSubmitEmail || isSubmitting}
                  className="font-sans text-sm px-5 py-3 bg-primary text-primary-foreground disabled:opacity-35 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                  onClick={() => void handleSubmit()}
                >
                  {isSubmitting ? "Submitting..." : "See my result"}
                </button>
              </div>
            </div>
          ) : null}

          {step === "result" && result ? (
            <div
              className="bg-white border-t-[3px] px-7 py-9 md:px-9 shadow-sm"
              style={{ borderTopColor: result.color }}
            >
              {submitError ? (
                <p className="font-sans text-xs text-muted mb-4" role="status">
                  We couldn&apos;t save your email right now, but here&apos;s
                  your result.
                </p>
              ) : null}
              <p
                className="font-sans text-sm mb-2"
                style={{ color: result.color }}
              >
                {result.label}
              </p>
              <h2 className="font-serif text-2xl text-primary mb-4">
                {result.title}
              </h2>
              <p className="text-muted text-lg leading-relaxed mb-7">
                {result.body}
              </p>
              <ResultLink
                href={result.ctaHref}
                external={result.ctaExternal}
                className="block text-center font-sans text-base px-5 py-3.5 text-white mb-3.5 transition-opacity hover:opacity-90"
                style={{ backgroundColor: result.color }}
              >
                {result.ctaLabel}
              </ResultLink>
              {result.secondaryLabel ? (
                <ResultLink
                  href={result.secondaryHref}
                  external={result.secondaryExternal}
                  className="block text-center font-sans text-sm text-muted underline underline-offset-2 hover:text-foreground"
                >
                  {result.secondaryLabel}
                </ResultLink>
              ) : null}
            </div>
          ) : null}

          <p className="max-w-lg mx-auto mt-9 text-center font-sans text-xs text-muted leading-relaxed">
            This quiz offers general financial education and is not
            individualized financial, tax, or legal advice. If you&apos;re facing
            a financial emergency, please also consider reaching out to a local
            financial counselor or crisis resource in your area.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
