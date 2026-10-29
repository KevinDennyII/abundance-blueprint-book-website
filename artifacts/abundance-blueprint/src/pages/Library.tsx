import { type ReactNode } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ShopifyBuyCollection } from "@/components/ShopifyBuyCollection";
import { ShopifyBuyProduct } from "@/components/ShopifyBuyProduct";
import { usePageMotion } from "@/lib/page-motion";
import { PageMeta } from "@/lib/seo";
import { SHOPIFY_GUIDES, type GuideBadgeTone } from "@/lib/shopify-buy-button";
import {
  CRISIS_PAGE_PATH,
  KIT_WEEKLY_PULSE_BUSINESS_FORM_URL,
  KIT_WEEKLY_PULSE_PERSONAL_FORM_URL,
  WORKSHOP_COMING_LABEL,
  WORKSHOP_WAITLIST_URL,
} from "@/lib/social";

const CARD =
  "flex flex-col rounded-xl border bg-white px-7 py-8 md:px-8 md:py-9 text-left shadow-sm";

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="font-sans text-xs tracking-[0.2em] uppercase text-secondary mb-5">
      {children}
    </p>
  );
}

type BadgeTone = GuideBadgeTone | "outline";

const BADGE_TONES: Record<BadgeTone, string> = {
  solid:
    "font-sans text-[11px] tracking-wider uppercase bg-primary text-primary-foreground px-3 py-1 rounded-full shrink-0",
  outline:
    "font-sans text-[11px] tracking-wider uppercase bg-card text-primary px-3 py-1 rounded-full border border-border shrink-0",
  new: "font-sans text-[11px] tracking-wider uppercase bg-secondary text-secondary-foreground px-3 py-1 rounded-full shrink-0",
};

function StatusBadge({
  children,
  tone = "solid",
}: {
  children: ReactNode;
  tone?: BadgeTone;
}) {
  return <span className={BADGE_TONES[tone]}>{children}</span>;
}

type GuideConfig = (typeof SHOPIFY_GUIDES)[keyof typeof SHOPIFY_GUIDES];

type GuideOffer = {
  variantId: string;
  priceLabel: string;
  nodeId: string;
  buttonText: string;
};

function GuideOfferSlot({
  label,
  offer,
  productId,
  tone,
}: {
  label: string;
  offer: GuideOffer;
  productId: string;
  tone: "solid" | "outline";
}) {
  return (
    <div className="rounded-lg bg-background px-4 py-4 flex flex-col gap-2">
      <p className="font-sans text-[10px] tracking-wider uppercase text-muted">
        {label}
      </p>
      {tone === "solid" ? (
        <p className="font-serif text-lg text-primary">{offer.priceLabel}</p>
      ) : (
        <p className="text-sm text-muted">{offer.priceLabel}</p>
      )}
      <ShopifyBuyProduct
        className="mt-auto shopify-buy-slot"
        productId={productId}
        variantId={offer.variantId}
        nodeId={offer.nodeId}
        buttonText={offer.buttonText}
        tone={tone}
      />
    </div>
  );
}

function GuideCard({
  guide,
  fadeInUp,
}: {
  guide: GuideConfig;
  fadeInUp: ReturnType<typeof usePageMotion>["fadeInUp"];
}) {
  return (
    <motion.article
      variants={fadeInUp}
      className={`${CARD} border-secondary/40`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <p className="font-sans text-xs tracking-[0.2em] uppercase text-secondary">
          {guide.eyebrow}
        </p>
        <StatusBadge tone={guide.badgeTone}>{guide.badge}</StatusBadge>
      </div>
      <h2 className="font-serif text-2xl text-primary mb-2">{guide.title}</h2>
      <p className="font-sans text-sm text-muted mb-3">{guide.audience}</p>
      <p className="text-muted leading-relaxed flex-1 mb-6">{guide.body}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-border">
        <GuideOfferSlot
          label="Digital"
          offer={guide.digital}
          productId={guide.productId}
          tone="solid"
        />
        <GuideOfferSlot
          label="Print"
          offer={guide.print}
          productId={guide.productId}
          tone="outline"
        />
      </div>
    </motion.article>
  );
}

export default function Library() {
  const { fadeInUp, staggerContainer } = usePageMotion();

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
                  <Button asChild variant="outline">
                    <a
                      href={KIT_WEEKLY_PULSE_PERSONAL_FORM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Personal Edition
                    </a>
                  </Button>
                </div>
                <p className="text-sm text-muted italic mt-5">
                  Business Edition is built for irregular income: owners,
                  owner-operators, and 1099 contractors.
                </p>
              </motion.article>
            </motion.div>

            <SectionLabel>Guides</SectionLabel>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-7 mb-12 md:mb-14"
            >
              {(
                Object.values(SHOPIFY_GUIDES) as GuideConfig[]
              ).map((guide) => (
                <GuideCard
                  key={guide.productId}
                  guide={guide}
                  fadeInUp={fadeInUp}
                />
              ))}
            </motion.div>

            <SectionLabel>Programs</SectionLabel>
            <motion.article
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className={`${CARD} border-border md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-14`}
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

            <SectionLabel>Merch</SectionLabel>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="rounded-xl border border-secondary/40 bg-white px-7 py-8 md:px-8 md:py-9 shadow-sm"
            >
              <div className="mb-6 max-w-2xl">
                <h2 className="font-serif text-2xl text-primary mb-2">
                  Long Money Shop
                </h2>
                <p className="text-muted leading-relaxed">
                  Everyday pieces carrying the words already part of how you
                  think about money.
                </p>
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
