import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  LONG_MONEY_CIRCLE_FACEBOOK_URL,
  SIMPLETEXTING_JOIN_FORM_URL,
} from "@/lib/social";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const circleHighlights = [
  "Honest conversations about money",
  "Weekly discussions",
  "Practical financial education",
  "A judgment-free community",
  "Encouragement and accountability",
];

export default function Circle() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 pt-24">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-3xl mx-auto text-center"
            >
              <motion.h1
                variants={fadeInUp}
                className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary mb-6"
              >
                The Long Money Circle
              </motion.h1>
              <motion.p
                variants={fadeInUp}
                className="font-sans text-lg md:text-xl text-secondary mb-12"
              >
                A free community for honest conversations about money, financial
                healing, and building Financial Harmony.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="text-left space-y-6 text-muted text-lg leading-relaxed mb-12"
              >
                <p>
                  Money is never just math. There's life beneath the numbers —
                  and that's exactly what we talk about here.
                </p>
                <p>
                  The Long Money Circle is a free community where we have honest
                  conversations about money, financial healing, and building
                  Financial Harmony.
                </p>
                <p>
                  The community is led by La'Toya Ray, CPA and author of
                  Abundance Blueprint: A Journey to Financial Harmony, who
                  believes that lasting financial change begins with both
                  Financial Healing and Financial Knowledge.
                </p>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="text-left mb-12 max-w-xl mx-auto"
              >
                <h2 className="font-serif text-2xl md:text-3xl text-primary mb-6 text-center">
                  What You'll Find Inside
                </h2>
                <ul className="space-y-3 text-muted text-lg">
                  {circleHighlights.map((item) => (
                    <li key={item} className="flex gap-3 items-start">
                      <span
                        className="text-secondary font-medium mt-0.5"
                        aria-hidden="true"
                      >
                        ✔
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div variants={fadeInUp} className="mb-20">
                <Button
                  asChild
                  className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6"
                >
                  <a
                    href={LONG_MONEY_CIRCLE_FACEBOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="link-join-circle-facebook"
                  >
                    Join The Long Money Circle
                  </a>
                </Button>
                <p className="mt-3 text-sm text-muted/80">Hosted on Facebook.</p>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="border-t border-border pt-16 mb-16"
              >
                <h2 className="font-serif text-3xl md:text-4xl text-primary mb-4">
                  Thoughts Beneath the Numbers
                </h2>
                <p className="text-muted text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                  Receive one thoughtful text each week about money, mindset,
                  and building Financial Harmony.
                </p>
                <div className="mx-auto w-full max-w-[470px] overflow-hidden rounded-xl border border-border bg-background shadow-sm">
                  <iframe
                    title="Join Thoughts Beneath the Numbers text list"
                    src={SIMPLETEXTING_JOIN_FORM_URL}
                    className="w-full border-0"
                    width={470}
                    height={520}
                    scrolling="no"
                    loading="lazy"
                  />
                </div>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="space-y-3 text-muted text-lg leading-relaxed"
              >
                <p>Money was never meant to be a conversation we avoid.</p>
                <p className="font-serif text-xl text-primary">
                  We'd love to have you in the Circle.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
