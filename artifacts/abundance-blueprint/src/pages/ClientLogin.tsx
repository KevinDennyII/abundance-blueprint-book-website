import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CoachAccountableLoginEmbed } from "@/components/CoachAccountableLoginEmbed";
import { PageMeta } from "@/lib/seo";
import { usePageMotion } from "@/lib/page-motion";
import { COACH_ACCOUNTABLE_CLIENT_LOGIN_URL } from "@/lib/social";
import { motion } from "framer-motion";

export default function ClientLogin() {
  const { fadeInUp, staggerContainer } = usePageMotion();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PageMeta path="/client-login" />
      <Navbar />

      <main className="flex-1 pt-32 md:pt-36">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-lg mx-auto text-center"
            >
              <motion.div
                variants={fadeInUp}
                className="mx-auto mb-8 h-px w-16 bg-secondary"
                aria-hidden="true"
              />
              <motion.h1
                variants={fadeInUp}
                className="font-serif text-4xl md:text-5xl text-primary mb-4"
              >
                Client Login
              </motion.h1>
              <motion.p
                variants={fadeInUp}
                className="font-sans text-lg text-muted leading-relaxed mb-12"
              >
                Sign in to The Long Money Table — your coaching portal for
                resources, notes, and progress.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="mx-auto w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm text-left"
              >
                <CoachAccountableLoginEmbed className="w-full p-2 sm:p-4" />
              </motion.div>

              {COACH_ACCOUNTABLE_CLIENT_LOGIN_URL ? (
                <motion.p
                  variants={fadeInUp}
                  className="mt-6 text-sm text-muted/80"
                >
                  Prefer a full page?{" "}
                  <a
                    href={COACH_ACCOUNTABLE_CLIENT_LOGIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary underline underline-offset-4 hover:text-primary"
                    data-testid="link-client-login-fallback"
                  >
                    Open login in a new tab
                  </a>
                </motion.p>
              ) : null}
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
