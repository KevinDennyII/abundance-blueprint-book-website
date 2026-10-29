import { type ReactNode } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ShopifyBuyCollection } from "@/components/ShopifyBuyCollection";
import { ShopifyBuyProduct } from "@/components/ShopifyBuyProduct";
import { PageMeta } from "@/lib/seo";
import { SHOPIFY_GUIDES } from "@/lib/shopify-buy-button";
import {
  CRISIS_PAGE_PATH,
  KIT_WEEKLY_PULSE_BUSINESS_FORM_URL,
  KIT_WEEKLY_PULSE_PERSONAL_FORM_URL,
  WORKSHOP_COMING_LABEL,
  WORKSHOP_WAITLIST_URL,
} from "@/lib/social";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="font-sans text-xs tracking-[0.2em] uppercase text-secondary mb-5">
      {children}
    </p>
  );
}

function StatusBadge({
  children,
  tone = "solid",
}: {
  children: ReactNode;
  tone?: "solid" | "outline" | "new";
}) {
  if (tone === "outline") {
    return (
      <span className="font-sans text-[11px] tracking-wider uppercase bg-card text-primary px-3 py-1 rounded-full border border-border shrink-0">
        {children}
      </span>
    );
  }
  if (tone === "new") {
    return (
      <span className="font-sans text-[11px] tracking-wider uppercase bg-secondary text-secondary-foreground px-3 py-1 rounded-full shrink-0">
        {children}
      </span>
    );
  }
  return (
    <span className="font-sans text-[11px] tracking-wider uppercase bg-primary text-primary-foreground px-3 py-1 rounded-full shrink-0">
      {children}
    </span>
  );
}

type GuideConfig = (typeof SHOPIFY_GUIDES)[keyof typeof SHOPIFY_GUIDES];

function GuideCard({ guide }: { guide: GuideConfig }) {
  return (
    <motion.article
      variants={fadeInUp}
      className="flex flex-col rounded-xl border border-secondary/40 bg-white px-7 py-8 md:px-8 md:py-9 text-left shadow-sm"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <p className="font-sans text-xs tracking-[0.2em] uppercase text-secondary">
          {guide.eyebrow}
        </p>
        <StatusBadge tone={guide.badge === "New" ? "new" : "solid"}>
          {guide.badge}
        </StatusBadge>
      </div>
      <h2 className="font-serif text-2xl text-primary mb-2">{guide.title}</h2>
      <p className="font-sans text-sm text-muted mb-3">{guide.audience}</p>
      <p className="text-muted leading-relaxed flex-1 mb-6">{guide.body}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-border">
        <div className="rounded-lg bg-background px-4 py-4 flex flex-col gap-2">
          <p className="font-sans text-[10px] tracking-wider uppercase text-muted">
            Digital
          </p>
          <p className="font-serif text-lg text-primary">
            {guide.digital.priceLabel}
          </p>
          <ShopifyBuyProduct
            className="mt-auto shopify-buy-slot"
            productId={guide.productId}
            variantId={guide.digital.variantId}
            nodeId={guide.digital.nodeId}
            buttonText={guide.digital.buttonText}
            tone="solid"
          />
        </div>
        <div className="rounded-lg bg-background px-4 py-4 flex flex-col gap-2">
          <p className="font-sans text-[10px] tracking-wider uppercase text-muted">
            Print
          </p>
          <p className="text-sm text-muted">{guide.print.priceLabel}</p>
          <ShopifyBuyProduct
            className="mt-auto shopify-buy-slot"
            productId={guide.productId}
            variantId={guide.print.variantId}
            nodeId={guide.print.nodeId}
            buttonText={guide.print.buttonText}
            tone="outline"
          />
        </div>
      </div>
    </motion.article>
  );
}

export default function Library() {
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
                framework, and the work of building real financial harmony.
              </motion.p>
            </motion.div>

            {/* 1) Free (Start Here) */}
            <SectionLabel>Free · Start here</SectionLabel>
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-muted leading-relaxed mb-6 max-w-2xl"
            >
              No cost, no catch. Start with whichever fits where you are this
              week.
            </motion.p>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-7 mb-12 md:mb-14"
            >
              <motion.article
                variants={fadeInUp}
                className="flex flex-col rounded-xl border border-border bg-card px-7 py-8 md:px-8 md:py-9 text-left"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <h2 className="font-serif text-2xl text-primary">
                    Crisis resources
                  </h2>
                  <StatusBadge>Free</StatusBadge>
                </div>
                <p className="text-muted leading-relaxed flex-1 mb-6">
                  If you&apos;re facing a financial emergency right now, start
                  here. Practical, judgment-free guidance for the moment
                  you&apos;re in.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border mt-auto">
                  <Button
                    asChild
                    className="bg-primary text-primary-foreground"
                  >
                    <Link href={CRISIS_PAGE_PATH}>Stabilization Roadmap</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href={CRISIS_PAGE_PATH}>Resource Guide</Link>
                  </Button>
                </div>
                <p className="text-sm text-muted/80 italic mt-4">
                  A printed copy will be available soon, at printing cost only.
                </p>
              </motion.article>

              <motion.article
                variants={fadeInUp}
                className="flex flex-col rounded-xl border border-secondary/40 bg-white px-8 py-9 md:px-10 md:py-10 text-left"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <h2 className="font-serif text-2xl md:text-[1.75rem] text-primary">
                    The Weekly Pulse
                  </h2>
                  <StatusBadge>Free</StatusBadge>
                </div>
                <p className="text-muted leading-relaxed flex-1 mb-7">
                  Money is alive. It comes in, it moves, it leaves. One short
                  weekly check-in helps you notice where it&apos;s going before
                  the month gets away from you.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
                  {KIT_WEEKLY_PULSE_BUSINESS_FORM_URL ? (
                    <Button
                      asChild
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <a
                        href={KIT_WEEKLY_PULSE_BUSINESS_FORM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Business Edition
                      </a>
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      aria-disabled="true"
                      title="Kit form link pending"
                      onClick={(e) => e.preventDefault()}
                    >
                      Business Edition
                    </Button>
                  )}
                  {KIT_WEEKLY_PULSE_PERSONAL_FORM_URL ? (
                    <Button asChild variant="outline">
                      <a
                        href={KIT_WEEKLY_PULSE_PERSONAL_FORM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Personal Edition
                      </a>
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      aria-disabled="true"
                      title="Kit form link pending"
                      onClick={(e) => e.preventDefault()}
                    >
                      Personal Edition
                    </Button>
                  )}
                </div>
                <p className="text-sm text-muted italic mt-5">
                  Business Edition is built for irregular income: owners,
                  owner-operators, and 1099 contractors.
                </p>
              </motion.article>
            </motion.div>

            {/* 2) Guides — Claude card layout + Shopify variant Buy Buttons */}
            <SectionLabel>Guides</SectionLabel>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-7 mb-12 md:mb-14"
            >
              <GuideCard guide={SHOPIFY_GUIDES.financialFoundations} />
              <GuideCard guide={SHOPIFY_GUIDES.businessNotAtm} />
            </motion.div>

            {/* 3) Programs */}
            <SectionLabel>Programs</SectionLabel>
            <motion.article
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 rounded-xl border border-border bg-white px-7 py-8 md:px-8 md:py-9 text-left mb-12 md:mb-14 shadow-sm"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start gap-3 mb-3">
                  <p className="font-sans text-xs tracking-[0.2em] uppercase text-secondary">
                    Self-paced
                  </p>
                  <StatusBadge tone="outline">{WORKSHOP_COMING_LABEL}</StatusBadge>
                </div>
                <h2 className="font-serif text-2xl text-primary mb-3">
                  Financial Foundations Workshop
                </h2>
                <p className="text-muted leading-relaxed max-w-xl">
                  Build real confidence with structure and clear guidance,
                  grounded in the same five foundations, on your own schedule.
                </p>
              </div>
              <div className="flex flex-col items-stretch sm:items-end gap-3 shrink-0">
                <p className="text-muted text-sm sm:text-right">
                  Price announced at launch
                </p>
                {WORKSHOP_WAITLIST_URL ? (
                  <Button asChild variant="outline">
                    <a
                      href={WORKSHOP_WAITLIST_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Join the Waitlist
                    </a>
                  </Button>
                ) : (
                  <Button variant="outline" disabled>
                    Join the Waitlist
                  </Button>
                )}
              </div>
            </motion.article>

            {/* 4) Merch — Claude card chrome; Shopify collection for products */}
            <SectionLabel>Merch</SectionLabel>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="rounded-xl border border-secondary/40 bg-white px-7 py-8 md:px-8 md:py-9 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
                <div className="max-w-2xl">
                  <h2 className="font-serif text-2xl text-primary mb-2">
                    Long Money Shop
                  </h2>
                  <p className="text-muted leading-relaxed">
                    Everyday pieces carrying the words already part of how you
                    think about money.
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <ShopifyBuyCollection
                  className="shopify-merch-collection min-h-[8rem]"
                  data-testid="shopify-merch-collection"
                />
              </div>
            </motion.div>

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
