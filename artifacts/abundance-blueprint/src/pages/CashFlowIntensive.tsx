import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageMeta } from "@/lib/seo";
import {
  CASH_FLOW_INTENSIVE_KICKOFF_URL,
  CASH_FLOW_INTENSIVE_PATH,
} from "@/lib/social";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const forYouIf = [
  "You own a business, work as an owner-operator, or invest in real estate.",
  "You already know something is off with your cash flow, and you want it mapped, not guessed at.",
  "Some months feel flush and others feel tight, and you can't say why.",
  "You're not sure what you can safely pay yourself.",
] as const;

const mapIncludes = [
  "A full year of real money in and out, by month and by week",
  "Your busy and slow pattern across the last four quarters",
  "A bill calendar showing which weeks run tight",
  "Your Base Pay and Ideal Pay numbers",
  "An account-structure recommendation",
  "A credit and debt review, if it applies to you",
] as const;

const liveSupport = [
  "30-minute Kickoff Call",
  "45-minute Findings Session, with homework",
  "60-minute Guided Weekly Pulse, where we do your first Pulse together",
  "A check-in text during your solo Pulse week",
  "30-minute Progress Session to adjust and wrap up",
] as const;

const steps = [
  {
    n: "01",
    title: "Book and share the basics",
    body: "Complete a short intake form and pay a 50% deposit to hold your spot.",
  },
  {
    n: "02",
    title: "Kickoff Call",
    body: "30 minutes to confirm your scope, your final price, and what to send.",
  },
  {
    n: "03",
    title: "I build your Map",
    body: "Once your documents are in, the analysis takes 5 to 7 business days.",
  },
  {
    n: "04",
    title: "Findings Session",
    body: "45 minutes walking through your Map. You leave with a clear plan and a short assignment.",
  },
  {
    n: "05",
    title: "Guided Weekly Pulse",
    body: "About two weeks later, we do your first Weekly Money Pulse together, with your real numbers.",
  },
  {
    n: "06",
    title: "Solo week, then Progress Session",
    body: "You do the Pulse on your own, with a check-in text from me. The next week, we adjust and wrap up.",
  },
] as const;

const faqs = [
  {
    q: "Is this bookkeeping or tax work?",
    a: "No. It's cash flow analysis and strategy. Bookkeeping and tax preparation are separate.",
  },
  {
    q: "How long does the whole thing take?",
    a: "About a week and a half from receiving your documents to your Findings Session, then about five weeks of guided follow-through.",
  },
  {
    q: "What happens when it ends?",
    a: "You keep everything. If you want ongoing support, we can talk about what fits. There's no pressure either way.",
  },
] as const;

function KickoffCta({
  className,
  testId,
}: {
  className: string;
  testId: string;
}) {
  const href = CASH_FLOW_INTENSIVE_KICKOFF_URL?.trim() || null;
  if (!href) {
    return (
      <span
        className={`${className} opacity-70 cursor-not-allowed`}
        title="Kickoff booking link coming soon"
        data-testid={testId}
      >
        Book your Kickoff Call
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      data-testid={testId}
    >
      Book your Kickoff Call
    </a>
  );
}

export default function CashFlowIntensive() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PageMeta path={CASH_FLOW_INTENSIVE_PATH} />
      <Navbar />

      <main className="flex-1 pt-32 md:pt-36">
        <section className="bg-primary text-primary-foreground py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.p
                variants={fadeInUp}
                className="font-sans text-sm text-accent mb-4 tracking-wide uppercase"
              >
                Work With Me · The Cash Flow Intensive
              </motion.p>
              <motion.h1
                variants={fadeInUp}
                className="font-serif text-4xl md:text-5xl lg:text-6xl mb-5 max-w-3xl leading-tight"
              >
                See what&apos;s really happening beneath your numbers.
              </motion.h1>
              <motion.p
                variants={fadeInUp}
                className="text-primary-foreground/85 text-lg md:text-xl leading-relaxed max-w-2xl mb-8"
              >
                Financial triage for your business and your household. A full
                year of your real cash flow, mapped: where the money came from,
                where it went, which weeks run tight, and exactly what structure
                would fix it.
              </motion.p>
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-4 items-center"
              >
                <KickoffCta
                  className="inline-block font-sans text-sm px-6 py-3.5 bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
                  testId="link-cfi-kickoff-hero"
                />
                <span className="font-sans text-sm text-accent">
                  Starting at $1,997
                </span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl grid md:grid-cols-2 gap-12 md:gap-16">
            <div>
              <h2 className="font-serif text-3xl text-primary mb-5">
                This is for you if…
              </h2>
              <ul className="space-y-3 text-muted leading-relaxed list-disc pl-5">
                {forYouIf.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-serif text-3xl text-primary mb-5">
                It&apos;s not the right fit if…
              </h2>
              <ul className="space-y-3 text-muted leading-relaxed list-disc pl-5">
                <li>
                  You&apos;re still deciding whether you need help with money at
                  all.{" "}
                  <Link
                    href="/circle"
                    className="text-primary underline underline-offset-2 hover:text-secondary transition-colors"
                  >
                    The Long Money Circle
                  </Link>{" "}
                  is a gentler place to start.
                </li>
                <li>You&apos;re looking for bookkeeping or tax preparation.</li>
                <li>
                  You want ongoing coaching for behavior change over several
                  months. That&apos;s the{" "}
                  <Link
                    href="/financial-wellness-reset"
                    className="text-primary underline underline-offset-2 hover:text-secondary transition-colors"
                  >
                    Financial Wellness Reset
                  </Link>
                  .
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-card py-16 md:py-20">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <p className="font-sans text-sm text-secondary mb-3">
              What you receive
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-primary mb-10 max-w-2xl">
              Your Cash Flow Map, and the support to use it.
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <article className="bg-white border-t-[3px] border-secondary px-6 py-7">
                <h3 className="font-serif text-2xl text-primary mb-2">
                  Your Cash Flow Map
                </h3>
                <p className="text-muted text-sm mb-4">
                  A document you keep, built from your real numbers.
                </p>
                <ul className="space-y-2 text-muted text-sm leading-relaxed list-disc pl-5">
                  {mapIncludes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
              <article className="bg-white border-t-[3px] border-secondary px-6 py-7">
                <h3 className="font-serif text-2xl text-primary mb-4">
                  Two tools to put it into practice
                </h3>
                <ul className="space-y-3 text-muted text-sm leading-relaxed list-disc pl-5">
                  <li>
                    <strong className="text-primary">
                      Money Movement Rules worksheet.
                    </strong>{" "}
                    Your written rules for how money moves between accounts, how
                    much, and when.
                  </li>
                  <li>
                    <strong className="text-primary">
                      <em>Your Business Is Not Your ATM</em> eGuide.
                    </strong>{" "}
                    A plain-language guide to separating business money from
                    personal money and paying yourself on purpose.
                  </li>
                </ul>
              </article>
              <article className="bg-white border-t-[3px] border-secondary px-6 py-7">
                <h3 className="font-serif text-2xl text-primary mb-4">
                  Live support with LaToya
                </h3>
                <ul className="space-y-2 text-muted text-sm leading-relaxed list-disc pl-5">
                  {liveSupport.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <p className="font-sans text-sm text-secondary mb-3">How it works</p>
            <h2 className="font-serif text-3xl md:text-4xl text-primary mb-10 max-w-2xl">
              From your numbers to a plan you can live inside.
            </h2>
            <ol className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 list-none p-0 m-0">
              {steps.map((step) => (
                <li
                  key={step.n}
                  className="border-t border-secondary pt-4 flex flex-col gap-2"
                >
                  <span className="font-serif text-3xl text-secondary">
                    {step.n}
                  </span>
                  <strong className="text-primary">{step.title}</strong>
                  <span className="text-muted text-sm leading-relaxed">
                    {step.body}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-primary text-primary-foreground py-16 md:py-20">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl grid md:grid-cols-2 gap-10 md:gap-14">
            <div>
              <p className="font-sans text-sm text-accent mb-3">Investment</p>
              <h2 className="font-serif text-3xl md:text-4xl mb-5">
                Priced by entity, not by property.
              </h2>
              <p className="text-primary-foreground/85 leading-relaxed mb-4">
                Five rentals under one LLC take about the same work to analyze as
                one. A second business or a second LLC is what adds to the work,
                so that&apos;s what adds to the price. Your personal finances are
                always included.
              </p>
              <p className="text-primary-foreground/75 text-sm leading-relaxed">
                50% deposit at booking. The balance is due before your Findings
                Session.
              </p>
            </div>
            <div className="border border-accent overflow-hidden self-start">
              <div className="flex justify-between gap-4 px-6 py-5 border-b border-primary-foreground/20">
                <div>
                  <strong>Base Intensive</strong>
                  <p className="text-sm text-primary-foreground/65 mt-1">
                    One business or one real estate LLC, plus personal
                  </p>
                </div>
                <span className="font-serif text-3xl text-accent shrink-0">
                  $1,997
                </span>
              </div>
              <div className="flex justify-between gap-4 px-6 py-5 border-b border-primary-foreground/20">
                <div>
                  <strong>Each additional entity</strong>
                  <p className="text-sm text-primary-foreground/65 mt-1">
                    A second business, LLC, or separate portfolio
                  </p>
                </div>
                <span className="font-serif text-3xl text-accent shrink-0">
                  +$450
                </span>
              </div>
              <div className="flex justify-between gap-4 px-6 py-4 text-sm">
                <span className="text-primary-foreground/65">
                  Example: a business plus one rental held separately
                </span>
                <strong>$2,447</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl grid md:grid-cols-2 gap-12 md:gap-16">
            <div>
              <p className="font-sans text-sm text-secondary mb-3">
                Before you book
              </p>
              <h2 className="font-serif text-3xl text-primary mb-5">
                Your business books need to be current.
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                This Intensive is built on your real numbers, so I work from your
                bookkeeping software&apos;s General Ledger rather than rebuilding
                your books from scratch. If you&apos;re behind, that&apos;s
                common. I&apos;ll refer you to a bookkeeper I trust, and we&apos;ll
                start once you&apos;re caught up.
              </p>
              <p className="text-muted leading-relaxed">
                Your personal finances need no bookkeeping. I review 12 months of
                your bank and credit card statements directly.
              </p>
            </div>
            <div>
              <h2 className="font-serif text-3xl text-primary mb-6">Questions</h2>
              <div className="space-y-5">
                {faqs.map((faq) => (
                  <div key={faq.q}>
                    <strong className="text-primary block mb-1">{faq.q}</strong>
                    <p className="text-muted text-sm leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="book"
          className="bg-card py-16 md:py-20 text-center"
        >
          <div className="container mx-auto px-4 md:px-6 max-w-xl">
            <h2 className="font-serif text-3xl md:text-4xl text-primary mb-4">
              Ready to see the full picture?
            </h2>
            <p className="text-muted leading-relaxed mb-8">
              Start with a 30-minute Kickoff Call. We&apos;ll confirm your scope
              and final price before any analysis begins.
            </p>
            <KickoffCta
              className="inline-block font-sans text-sm px-6 py-3.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              testId="link-cfi-kickoff-footer"
            />
            <p className="mt-8 text-xs text-muted leading-relaxed">
              The Cash Flow Intensive is financial education and cash flow
              analysis based on the information you provide. It is not
              bookkeeping, tax preparation, legal advice, or investment advisory
              services. For decisions with legal, tax, or investment
              implications, consult the appropriate licensed professional.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
