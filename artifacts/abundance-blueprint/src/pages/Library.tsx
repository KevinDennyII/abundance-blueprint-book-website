import { useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { PageMeta } from "@/lib/seo";
import {
  CRISIS_RESOURCE_GUIDE_URL,
  CRISIS_STABILIZATION_ROADMAP_URL,
} from "@/lib/social";
import { motion } from "framer-motion";

/**
 * Product ecosystem (incomplete — capture for future implementation):
 *
 * - E-guide / Financial Foundations Workbook
 *   Digital: Kit.com commerce (`KIT_COMMERCE_SCRIPT` + product URL below)
 *   Physical: Lulu Direct (`LULU_PHYSICAL_URL`)
 * - Workshops / educational content: Coach Accountable (checkout TBD)
 * - Merchandise: Printful (TBD) — keep as the last catalog card
 * - Free crisis guides: currently Google Drive links in `@/lib/social`
 *   TODO: evaluate converting to free Kit.com products for delivery + list growth
 *
 * Checkout platforms differ (Kit, Lulu, Coach Accountable, Printful, Drive).
 * TODO: centralize or keep `/library` as a unified landing that routes each CTA
 * to its respective checkout rather than embedding multiple storefronts.
 *
 * Design reference: Long Money Library mockup (guide + workshop side-by-side;
 * merch last).
 */

const KIT_COMMERCE_SCRIPT =
  "https://long-money-concepts-inc.kit.com/commerce.js";

// TODO(Kit): confirm canonical product slug if workbook is renamed to "e-guide"
const WORKBOOK_URL =
  "https://long-money-concepts-inc.kit.com/products/financial-foundations-workbook";

// Lulu Direct — physical Financial Foundations print checkout
const LULU_PHYSICAL_URL =
  "https://svc.lulu.com/?items=49658522-c522-49f0-a220-f3119faac926";

// TODO(Coach Accountable): workshop enrollment / checkout URL + price
const WORKSHOP_URL: string | null = null;

// TODO(Printful): merchandise storefront or embed — last card only when ready
const PRINTFUL_SHOP_URL: string | null = null;

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

export default function Library() {
  useEffect(() => {
    const existing = document.querySelector(
      `script[src="${KIT_COMMERCE_SCRIPT}"]`,
    );
    if (existing) return;

    const script = document.createElement("script");
    script.src = KIT_COMMERCE_SCRIPT;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PageMeta path="/library" />
      <Navbar />

      <main className="flex-1 pt-32 md:pt-36">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-center mb-14 md:mb-16"
            >
              <motion.p
                variants={fadeInUp}
                className="font-sans text-xs tracking-[0.2em] uppercase text-secondary mb-4"
              >
                Guides, tools &amp; programs
              </motion.p>
              <motion.h1
                variants={fadeInUp}
                className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary mb-5"
              >
                The Long Money Library
              </motion.h1>
              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl text-muted leading-relaxed max-w-2xl mx-auto"
              >
                Guides, tools, and programs that map back to the HEALS™
                framework — and the work of building real financial harmony.
              </motion.p>
            </motion.div>

            {/* Free crisis resources — Drive today; Kit product TBD */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="mb-12 md:mb-14 rounded-xl border border-border bg-card px-6 py-7 md:px-8 md:py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
            >
              <div className="text-left max-w-xl">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h2 className="font-serif text-2xl text-primary">
                    Crisis resources
                  </h2>
                  <span className="font-sans text-[11px] tracking-wider uppercase bg-primary text-primary-foreground px-3 py-1 rounded-full">
                    Available now
                  </span>
                </div>
                <p className="text-muted leading-relaxed">
                  If you&apos;re facing a financial emergency right now, start
                  here — practical, judgment-free guidance for the moment
                  you&apos;re in.
                </p>
                {/* TODO: convert Drive PDFs → free Kit.com products for delivery + tagging */}
                <p className="text-sm text-muted/80 italic mt-2">
                  A printed copy will be available soon, at printing cost only.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Button asChild className="bg-primary text-primary-foreground">
                  <a
                    href={CRISIS_STABILIZATION_ROADMAP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Stabilization Roadmap
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a
                    href={CRISIS_RESOURCE_GUIDE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Resource Guide
                  </a>
                </Button>
              </div>
            </motion.div>

            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="font-sans text-xs tracking-[0.2em] uppercase text-secondary mb-5"
            >
              Guides &amp; programs
            </motion.p>

            {/* Guide + workshop side by side; merch is the last card below */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid md:grid-cols-2 gap-6 md:gap-7 mb-6 md:mb-7"
            >
              {/* E-guide: Kit digital + Lulu physical */}
              <motion.article
                variants={fadeInUp}
                className="flex flex-col rounded-xl border border-secondary/40 bg-white px-7 py-8 md:px-8 md:py-9 text-left"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <p className="font-sans text-xs tracking-[0.2em] uppercase text-secondary">
                    Guide + workbook
                  </p>
                  <span className="font-sans text-[11px] tracking-wider uppercase bg-primary text-primary-foreground px-3 py-1 rounded-full">
                    Available now
                  </span>
                </div>
                <h2 className="font-serif text-2xl text-primary mb-3">
                  Financial Foundations
                </h2>
                <p className="text-muted leading-relaxed flex-1 mb-6">
                  A guide and workbook — five foundations, plain-language
                  teaching, and real journal space to make it yours.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-border">
                  <div className="rounded-lg bg-background px-4 py-4 flex flex-col gap-2">
                    <p className="font-sans text-[10px] tracking-wider uppercase text-muted">
                      Digital
                    </p>
                    <p className="font-serif text-lg text-primary">$27</p>
                    {/* Kit.com commerce checkout */}
                    <Button
                      asChild
                      size="sm"
                      className="bg-primary text-primary-foreground mt-auto"
                      data-testid="link-workbook"
                    >
                      <a href={WORKBOOK_URL}>Buy Now</a>
                    </Button>
                  </div>
                  <div className="rounded-lg bg-background px-4 py-4 flex flex-col gap-2">
                    <p className="font-sans text-[10px] tracking-wider uppercase text-muted">
                      Physical
                    </p>
                    <p className="text-sm text-muted">Print on demand</p>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="mt-auto"
                      data-testid="link-workbook-print"
                    >
                      <a
                        href={LULU_PHYSICAL_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Buy print
                      </a>
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted italic text-right mt-3">
                  Physical copy via Lulu Direct
                </p>
              </motion.article>

              {/* Workshop: Coach Accountable */}
              <motion.article
                variants={fadeInUp}
                className="flex flex-col rounded-xl border border-border bg-white px-7 py-8 md:px-8 md:py-9 text-left"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <p className="font-sans text-xs tracking-[0.2em] uppercase text-secondary">
                    Self-paced
                  </p>
                  <span className="font-sans text-[11px] tracking-wider uppercase bg-card text-primary px-3 py-1 rounded-full border border-border">
                    Coming soon
                  </span>
                </div>
                <h2 className="font-serif text-2xl text-primary mb-3">
                  Financial Foundations Workshop
                </h2>
                <p className="text-muted leading-relaxed flex-1 mb-6">
                  Build real confidence with structure and clear guidance —
                  grounded in the same five foundations, on your own schedule.
                </p>
                <div className="flex items-center justify-between gap-4 pt-4 border-t border-border mt-auto">
                  <p className="text-muted">Price TBD</p>
                  {/* TODO(Coach Accountable): workshop checkout / enrollment */}
                  <Button variant="outline" disabled={!WORKSHOP_URL}>
                    {WORKSHOP_URL ? "Enroll" : "Notify Me"}
                  </Button>
                </div>
                <p className="text-xs text-muted italic text-right mt-3">
                  Hosted on Coach Accountable — launching next month
                </p>
              </motion.article>
            </motion.div>

            {/* Merchandise last — Printful TBD */}
            <motion.article
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="flex flex-col rounded-xl border border-border bg-white px-7 py-8 md:px-8 md:py-9 text-left"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <p className="font-sans text-xs tracking-[0.2em] uppercase text-secondary">
                  Merch
                </p>
                <span className="font-sans text-[11px] tracking-wider uppercase bg-card text-primary px-3 py-1 rounded-full border border-border">
                  Coming soon
                </span>
              </div>
              <h2 className="font-serif text-2xl text-primary mb-3">
                Long Money Shop
              </h2>
              <p className="text-muted leading-relaxed mb-6 max-w-2xl">
                Everyday pieces carrying the words already part of how you
                think about money.
              </p>
              <div className="flex items-center justify-between gap-4 pt-4 border-t border-border">
                <p className="text-muted">Various</p>
                {/* TODO(Printful): last catalog card — wire storefront when ready */}
                <Button variant="outline" disabled={!PRINTFUL_SHOP_URL}>
                  {PRINTFUL_SHOP_URL ? "Shop merch" : "Notify Me"}
                </Button>
              </div>
              <p className="text-xs text-muted italic text-right mt-3">
                Printful fulfillment — launching soon
              </p>
            </motion.article>

            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center text-muted italic mt-12 py-6 border border-dashed border-secondary/40 rounded-xl"
            >
              More additions to the Library are on the way.
            </motion.p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
