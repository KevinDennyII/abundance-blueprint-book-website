import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
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

const services = [
  {
    eyebrow: "Flagship program",
    title: "Financial Wellness Reset",
    body: "A 12-week guided one-on-one experience built on the HEALS™ Method — moving you from where you are now into real, structural financial change. Each week builds on the last, following the HEALS™ sequence from the story you inherited about money into sustainable systems and lasting habits.",
    cta: "Learn more & apply",
    href: "/financial-wellness-reset",
    secondary: false,
  },
  {
    eyebrow: "Ongoing support",
    title: "Advisory Membership",
    body: "Monthly 1:1 sessions applying the HEALS™ Method to your real financial decisions — for clients who've completed foundational work and want continued accountability, planning guidance, and support as life changes.",
    cta: "Take the readiness check",
    href: "/readiness-assessment?source=advisory",
    secondary: false,
  },
  {
    eyebrow: "Free community",
    title: "The Long Money Circle",
    body: "A growing community space rooted in the HEALS™ Method, where financial healing and financial knowledge grow together — currently gathering in our free Facebook group. This is the front door to everything Long Money Concepts offers — a place to experience the framework in community before going deeper on your own.",
    cta: "Join the community",
    href: "/circle",
    secondary: true,
  },
  {
    eyebrow: "Standalone tools",
    title: "Workshops & guides",
    body: "Standalone tools built from the HEALS™ Method — Honor, Educate, Act, Live, Sow — for people who want the framework without the full program. Built directly from the Abundance Blueprint manuscript. Free crisis resources are available now; a video series is coming soon.",
    // TODO: Long Money Library lives on /library (Kit e-guide, Lulu print, Coach Accountable workshops, Printful merch last)
    cta: "Browse the Library",
    href: "/library",
    secondary: true,
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
              className="grid md:grid-cols-2 gap-6 md:gap-7 max-w-5xl mx-auto"
            >
              {services.map((service) => (
                <motion.article
                  key={service.title}
                  variants={fadeInUp}
                  className="flex flex-col border-t-[3px] border-secondary bg-white px-7 py-8 md:px-8 md:py-9"
                >
                  <p className="font-sans text-sm text-secondary mb-2.5">
                    {service.eyebrow}
                  </p>
                  <h2 className="font-serif text-2xl text-primary mb-3.5">
                    {service.title}
                  </h2>
                  <p className="text-muted leading-relaxed flex-1 mb-6">
                    {service.body}
                  </p>
                  {service.secondary ? (
                    <Link
                      href={service.href}
                      className="inline-block text-center font-sans text-sm px-5 py-3.5 border-[1.5px] border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {service.cta}
                    </Link>
                  ) : (
                    <Link
                      href={service.href}
                      className="inline-block text-center font-sans text-sm px-5 py-3.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      {service.cta}
                    </Link>
                  )}
                </motion.article>
              ))}
            </motion.div>
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
            <a
              href={DISCOVERY_CALL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-sans px-6 py-3.5 bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
              data-testid="link-discovery-call"
            >
              Book a discovery call
            </a>
            <p className="mt-6 text-sm text-primary-foreground/60">
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
