import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageMeta } from "@/lib/seo";
import {
  CRISIS_RESOURCE_GUIDE_URL,
  CRISIS_STABILIZATION_ROADMAP_URL,
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

const phases = [
  {
    letter: "Honor",
    desc: "Understanding the money story you inherited — where your patterns and beliefs actually came from.",
  },
  {
    letter: "Educate",
    desc: "Building real financial visibility and literacy — including full access to your Monarch Money dashboard starting in Week 3.",
  },
  {
    letter: "Act",
    desc: "Practicing new behaviors and putting systems in place, in real time, with support.",
  },
  {
    letter: "Live",
    desc: "Integrating what's been built so it holds up under real life, not just in session.",
  },
  {
    letter: "Sow",
    desc: "Moving toward stewardship — planning forward, not just catching up.",
  },
] as const;

const included = [
  "Twelve weekly 1:1 sessions with LaToya",
  "Pre-session material before each session — reflection and preparation, not homework to grade",
  "Notion client portal for resources, notes, and progress",
  "Monarch Money dashboard access, beginning Week 3",
  "Weekly written deliverables and follow-up within 48 business hours",
  "Session recordings available with your consent",
] as const;

export default function FinancialWellnessReset() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PageMeta path="/financial-wellness-reset" />
      <Navbar />

      <main className="flex-1 pt-24">
        <section className="py-14 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-2xl mx-auto text-center mb-14"
            >
              <motion.p
                variants={fadeInUp}
                className="font-sans text-sm text-secondary mb-3"
              >
                Flagship program
              </motion.p>
              <motion.h1
                variants={fadeInUp}
                className="font-serif text-4xl md:text-5xl text-primary mb-5"
              >
                The Financial Wellness Reset
              </motion.h1>
              <motion.p
                variants={fadeInUp}
                className="text-muted text-lg leading-relaxed"
              >
                A 12-week, one-on-one guided experience built on the HEALS™
                Method — moving you from where you are now into real, structural
                financial change. Not information you&apos;ve already heard. A
                place to go deeper on what you actually need to do differently.
              </motion.p>
            </motion.div>

            <div className="max-w-2xl mx-auto space-y-12">
              <section>
                <h2 className="font-serif text-2xl text-primary border-b-2 border-accent pb-3 mb-5">
                  How the 12 weeks are structured
                </h2>
                <p className="text-muted mb-5 leading-relaxed">
                  Each week is a weekly 1:1 session with LaToya, following the
                  HEALS™ Method from start to finish — so the work moves in
                  order, not information overload all at once.
                </p>
                <ul className="space-y-3.5">
                  {phases.map((phase) => (
                    <li
                      key={phase.letter}
                      className="flex flex-col sm:flex-row sm:gap-4 sm:items-baseline bg-white px-5 py-4 border-l-[3px] border-secondary"
                    >
                      <span className="font-sans text-sm font-bold text-secondary min-w-[5.5rem] shrink-0">
                        {phase.letter}
                      </span>
                      <span className="text-muted">{phase.desc}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-primary border-b-2 border-accent pb-3 mb-5">
                  What&apos;s included
                </h2>
                <ul className="space-y-3">
                  {included.map((item) => (
                    <li
                      key={item}
                      className="relative pl-5 text-muted leading-relaxed before:content-['—'] before:absolute before:left-0 before:text-secondary"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-primary border-b-2 border-accent pb-3 mb-5">
                  Investment
                </h2>
                <div className="bg-white border-t-[3px] border-secondary p-7 md:p-8">
                  <p className="font-serif text-3xl text-primary mb-1">$8,000</p>
                  <p className="text-muted mb-5">
                    for the complete 12-week program
                  </p>
                  <div className="space-y-2.5">
                    <div className="font-sans text-sm text-muted bg-background border border-border px-4 py-3">
                      <strong className="text-foreground">Paid in full</strong>{" "}
                      — $8,000 due at signing, prior to your first session
                    </div>
                    <div className="font-sans text-sm text-muted bg-background border border-border px-4 py-3">
                      <strong className="text-foreground">
                        Two installments
                      </strong>{" "}
                      — $4,000 due at signing, $4,000 due at the start of Week 6
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="font-serif text-2xl text-primary border-b-2 border-accent pb-3 mb-5">
                  What happens after
                </h2>
                <div className="border border-dashed border-border bg-background/60 p-6 space-y-4 text-muted leading-relaxed">
                  <p>
                    The Reset isn&apos;t a program you finish and then figure out
                    on your own. Immediately following your final session, you
                    transition automatically into the{" "}
                    <strong className="text-foreground">
                      Advisory Membership
                    </strong>{" "}
                    ($497/month) — no separate enrollment step.
                  </p>
                  <p>
                    Membership includes one monthly 1:1 session, text access
                    between sessions, access to member workshops as they&apos;re
                    released, and our newsletter and text series.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </section>

        <section className="bg-primary text-primary-foreground py-14 md:py-16 text-center">
          <div className="container mx-auto px-4 md:px-6 max-w-xl">
            <h2 className="font-serif text-3xl mb-4">
              Ready to talk it through?
            </h2>
            <p className="text-accent/90 mb-7 leading-relaxed">
              Every Reset engagement starts with a discovery call — a chance to
              talk through where you are and make sure this is the right fit
              before anything else.
            </p>
            <Link
              href="/readiness-assessment?source=reset"
              className="inline-block font-sans px-6 py-3.5 bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
              data-testid="link-readiness-from-reset"
            >
              Take the 2-minute readiness check
            </Link>
          </div>
        </section>

        <p className="max-w-2xl mx-auto px-4 py-10 text-center font-sans text-xs text-muted leading-relaxed">
          The Financial Wellness Reset is financial education and coaching. It
          is not tax, legal, or investment advisory services, and is not a
          substitute for licensed financial therapy or crisis intervention. If
          you&apos;re in immediate financial crisis, start with our free{" "}
          <a
            href={CRISIS_STABILIZATION_ROADMAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-primary"
          >
            Crisis Stabilization Roadmap
          </a>{" "}
          and{" "}
          <a
            href={CRISIS_RESOURCE_GUIDE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-primary"
          >
            Resource Guide
          </a>
          .
        </p>
      </main>

      <Footer />
    </div>
  );
}
