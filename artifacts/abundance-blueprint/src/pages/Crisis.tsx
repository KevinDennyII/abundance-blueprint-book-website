import { Link } from "wouter";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { usePageMotion } from "@/lib/page-motion";
import { PageMeta } from "@/lib/seo";
import {
  CRISIS_RESOURCE_GUIDE_URL,
  CRISIS_STABILIZATION_ROADMAP_URL,
} from "@/lib/social";

const DOWNLOADS = [
  {
    title: "Crisis Stabilization Roadmap",
    body: "A clear first path when money feels unstable — what to do now, next, and this week.",
    href: CRISIS_STABILIZATION_ROADMAP_URL,
    tone: "solid" as const,
  },
  {
    title: "Crisis Resource Guide",
    body: "Supporting resources and next steps when you need steady ground under you.",
    href: CRISIS_RESOURCE_GUIDE_URL,
    tone: "outline" as const,
  },
] as const;

export default function Crisis() {
  const { fadeInUp, staggerContainer } = usePageMotion();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PageMeta path="/crisis" />
      <Navbar />

      <main className="flex-1 pt-32 md:pt-36">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-center mb-12 md:mb-14"
            >
              <motion.p
                variants={fadeInUp}
                className="font-sans text-xs tracking-[0.2em] uppercase text-secondary mb-4"
              >
                Free · No signup
              </motion.p>
              <motion.h1
                variants={fadeInUp}
                className="font-serif text-4xl md:text-5xl text-primary mb-5"
              >
                Crisis resources
              </motion.h1>
              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl text-muted leading-relaxed max-w-2xl mx-auto"
              >
                If you&apos;re facing a financial emergency right now, start
                here — practical, judgment-free guidance for the moment
                you&apos;re in.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-5"
            >
              {DOWNLOADS.map((item) => (
                <motion.article
                  key={item.href}
                  variants={fadeInUp}
                  className="rounded-xl border border-border bg-card px-6 py-7 md:px-8 md:py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5"
                >
                  <div className="text-left">
                    <h2 className="font-serif text-2xl text-primary mb-2">
                      {item.title}
                    </h2>
                    <p className="text-muted leading-relaxed">{item.body}</p>
                  </div>
                  <Button
                    asChild
                    variant={item.tone === "outline" ? "outline" : "default"}
                    className={
                      item.tone === "solid"
                        ? "bg-primary text-primary-foreground shrink-0"
                        : "shrink-0"
                    }
                  >
                    <a
                      href={item.href}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download PDF
                    </a>
                  </Button>
                </motion.article>
              ))}
            </motion.div>

            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center text-muted mt-12"
            >
              Looking for more tools?{" "}
              <Link
                href="/library"
                className="text-primary underline-offset-4 hover:underline"
              >
                Browse the Library
              </Link>
            </motion.p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
