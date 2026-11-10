import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CoachAccountableEmbed } from "@/components/CoachAccountableEmbed";
import { PageMeta } from "@/lib/seo";
import { DISCOVERY_CALL_URL } from "@/lib/social";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const READINESS_RESET_HREF = "/readiness-assessment?source=reset";

const intensives = [
  {
    title: "Cash Flow Intensive",
    body: "For business owners and real estate investors whose business money and personal money have gotten tangled. We'll trace where your money goes, set the rules for how it moves, and build a weekly rhythm you can keep.",
  },
  {
    title: "Divorce Recovery",
    body: "For rebuilding your financial life on your own terms after a marriage ends: understanding where you stand, making decisions with a clear head, and building a foundation that's yours.",
  },
  {
    title: "Career Transitions",
    body: "For job loss, a career change, retirement, or the leap into self-employment. We'll plan for the gap, the change in income, and what you want the next chapter to look like.",
  },
  {
    title: "Passing It Forward",
    body: "For when you're ready to think beyond yourself: helping family without hurting your own stability, giving with intention, talking about money with the people you love, and getting clear on what you want to leave behind.",
  },
] as const;

export default function WorkWithMe() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PageMeta path="/work-with-me" />
      <Navbar />

      <main className="flex-1 pt-32 md:pt-36">
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-2xl mx-auto text-center mb-14 md:mb-16"
            >
              <motion.div
                variants={fadeInUp}
                className="mx-auto mb-5 h-0.5 w-7 bg-secondary"
                aria-hidden="true"
              />
              <motion.h1
                variants={fadeInUp}
                className="font-serif text-4xl md:text-5xl text-primary mb-5"
              >
                Work with me
              </motion.h1>
              <motion.p
                variants={fadeInUp}
                className="text-muted text-lg leading-relaxed"
              >
                Every offering below moves you through Honor, Educate, Act, Live,
                and Sow — the same framework at the heart of{" "}
                <em>Abundance Blueprint: A Journey to Financial Harmony</em>.
                There&apos;s life beneath the numbers. Here&apos;s where we start
                working on it together.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-6 md:gap-7 max-w-6xl mx-auto"
            >
              {/* Live Cohort */}
              <motion.article
                variants={fadeInUp}
                className="flex flex-col border-t-[3px] border-secondary bg-white px-7 py-8 md:px-8 md:py-9"
              >
                <p className="font-sans text-sm text-secondary mb-2.5">
                  Grow together
                </p>
                <h2 className="font-serif text-2xl text-primary mb-2">
                  Live Cohort
                </h2>
                <p className="font-serif text-3xl text-secondary mb-4">
                  $2,997{" "}
                  <span className="text-lg font-sans font-normal text-muted">
                    / person
                  </span>
                </p>
                <ul className="text-muted leading-relaxed space-y-2 flex-1 mb-5 list-disc pl-5">
                  <li>
                    The group version of the Reset: 12 weeks, 4 to 8 people
                  </li>
                  <li>One private 1:1 session included</li>
                  <li>Guided curriculum and live teaching</li>
                  <li>Community, accountability, and support</li>
                </ul>
                <p className="bg-card text-sm text-foreground leading-relaxed px-4 py-3 mb-6">
                  <strong className="text-primary">First cohort:</strong> May
                  11, 2027. Three cohorts a year.
                </p>
                <Link
                  href={READINESS_RESET_HREF}
                  className="inline-block text-center font-sans text-sm px-5 py-3.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  data-testid="link-readiness-cohort"
                >
                  Take the readiness check
                </Link>
              </motion.article>

              {/* 1:1 Reset */}
              <motion.article
                variants={fadeInUp}
                className="flex flex-col border-t-[3px] border-accent bg-primary text-primary-foreground px-7 py-8 md:px-8 md:py-9"
              >
                <p className="font-sans text-sm text-accent mb-2.5">
                  Deep work, one-on-one
                </p>
                <h2 className="font-serif text-2xl mb-2">
                  Financial Wellness Reset (1:1)
                </h2>
                <p className="font-serif text-3xl text-accent mb-4">$8,000</p>
                <ul className="text-primary-foreground/85 leading-relaxed space-y-2 flex-1 mb-6 list-disc pl-5">
                  <li>
                    A 12-week private coaching experience, starting when
                    you&apos;re ready
                  </li>
                  <li>Weekly 1:1 sessions</li>
                  <li>Personalized strategy and accountability</li>
                  <li>
                    Move from where you are to real, sustainable change
                  </li>
                </ul>
                <Link
                  href={READINESS_RESET_HREF}
                  className="inline-block text-center font-sans text-sm px-5 py-3.5 bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
                  data-testid="link-readiness-reset"
                >
                  Take the readiness check
                </Link>
              </motion.article>

              {/* Advisory — no button */}
              <motion.article
                variants={fadeInUp}
                className="flex flex-col border-t-[3px] border-secondary bg-white px-7 py-8 md:px-8 md:py-9"
              >
                <p className="font-sans text-sm text-secondary mb-2.5">
                  Ongoing support
                </p>
                <h2 className="font-serif text-2xl text-primary mb-2">
                  Advisory Membership
                </h2>
                <p className="font-serif text-3xl text-secondary mb-4">
                  $497{" "}
                  <span className="text-lg font-sans font-normal text-muted">
                    / month
                  </span>
                </p>
                <ul className="text-muted leading-relaxed space-y-2 flex-1 mb-6 list-disc pl-5">
                  <li>Ongoing 1:1 support</li>
                  <li>
                    The Self-Paced Reset included, one module unlocked each
                    month
                  </li>
                  <li>
                    Continued guidance, accountability, and strategy
                  </li>
                  <li>
                    A long-term community committed to your growth
                  </li>
                </ul>
                <p className="text-sm italic text-muted leading-relaxed border-t border-border pt-5">
                  By invitation, after completing any version of the Financial
                  Wellness Reset, or a Strategic Intensive.
                </p>
              </motion.article>
            </motion.div>

            {/* Strategic Intensives — full width */}
            <motion.article
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={fadeInUp}
              className="max-w-6xl mx-auto mt-6 md:mt-7 bg-primary text-primary-foreground px-7 py-9 md:px-10 md:py-11"
            >
              <div className="grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-6 md:gap-10 md:items-end mb-8 md:mb-10">
                <div>
                  <p className="font-sans text-sm text-accent mb-2.5">
                    Specialized deep work
                  </p>
                  <h2 className="font-serif text-3xl md:text-4xl mb-3">
                    Strategic Intensives
                  </h2>
                  <p className="font-serif text-2xl text-accent">
                    Starting at $1,997
                  </p>
                </div>
                <p className="text-primary-foreground/85 leading-relaxed">
                  Focused, project-based work for a specific season of your
                  financial life. Every intensive starts with a discovery call,
                  so we can shape the work around where you actually are.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 md:gap-8 mb-8">
                {intensives.map((item) => (
                  <div
                    key={item.title}
                    className="border-t border-accent/70 pt-4"
                  >
                    <h3 className="font-serif text-xl text-accent mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-primary-foreground/80 leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>

              <a
                href={DISCOVERY_CALL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-sans text-sm px-5 py-3.5 bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
                data-testid="link-discovery-intensives"
              >
                Book a discovery call
              </a>
            </motion.article>
          </div>
        </section>

        {/* Start with a single session — CoachAccountable embed */}
        <section className="bg-card py-16 md:py-20">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className="max-w-xl mb-8 md:mb-10">
              <p className="font-sans text-sm text-secondary mb-2.5">
                No long commitment
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-primary">
                Start with a single session
              </h2>
            </div>
            <CoachAccountableEmbed />
          </div>
        </section>

        <section className="bg-primary text-primary-foreground py-16 md:py-20 text-center">
          <div className="container mx-auto px-4 md:px-6 max-w-xl">
            <h2 className="font-serif text-3xl md:text-4xl mb-4">
              Not sure where to start?
            </h2>
            <p className="text-accent/90 text-lg mb-8 leading-relaxed">
              Every service on this page answers the same question: what&apos;s
              really happening beneath the numbers? If you&apos;re not sure which
              one fits, start with a free discovery call.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href={DISCOVERY_CALL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-sans px-6 py-3.5 bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
                data-testid="link-discovery-call"
              >
                Book a discovery call
              </a>
              <Link
                href={READINESS_RESET_HREF}
                className="inline-block font-sans px-6 py-3.5 border-[1.5px] border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
                data-testid="link-readiness-cta"
              >
                Take the readiness check
              </Link>
            </div>
            <p className="mt-6 text-sm text-primary-foreground/75 leading-relaxed">
              Not ready for a program yet? Join our free{" "}
              <Link
                href="/circle"
                className="underline underline-offset-2 hover:text-accent transition-colors"
              >
                community
              </Link>
              , or find the Self-Paced Reset and guides in the{" "}
              <Link
                href="/library"
                className="underline underline-offset-2 hover:text-accent transition-colors"
              >
                Library
              </Link>
              .
            </p>
            <p className="mt-4 text-sm text-primary-foreground/60">
              Looking for speaking, bulk book orders, or something else?{" "}
              <Link
                href="/contact"
                className="underline underline-offset-2 hover:text-accent transition-colors"
              >
                Send a message
              </Link>
              .
            </p>
          </div>
        </section>

        <p className="max-w-xl mx-auto px-4 py-10 text-center font-sans text-sm text-muted">
          <strong className="text-primary">HEALS™</strong> — Honor, Educate,
          Act, Live, Sow. The framework behind everything Long Money Concepts
          offers.
        </p>
      </main>

      <Footer />
    </div>
  );
}
