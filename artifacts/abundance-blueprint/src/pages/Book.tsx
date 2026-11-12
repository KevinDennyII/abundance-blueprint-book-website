import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { PageMeta } from "@/lib/seo";
import { KIT_BOOK_LAUNCH_URL } from "@/lib/social";
import { motion } from "framer-motion";
import frontCover from "@assets/AB_Front_Cover_1779852599997.png";
import backCover from "@assets/AB_Back_Cover_1779852599997.png";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function Book() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PageMeta path="/book" />
      <Navbar />
      
      <main className="flex-1 pt-32 md:pt-36">
        {/* Book Hero */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative max-w-md mx-auto lg:mx-0 w-full"
              >
                <img 
                  src={frontCover} 
                  alt="Abundance Blueprint Book Cover" 
                  className="w-full h-auto drop-shadow-2xl rounded-sm"
                />
              </motion.div>

              <motion.div 
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.h1 variants={fadeInUp} className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary leading-tight mb-6">
                  Abundance Blueprint
                </motion.h1>
                <motion.h2 variants={fadeInUp} className="text-xl md:text-2xl text-secondary mb-8 font-serif">
                  A Journey to Financial Harmony
                </motion.h2>

                <motion.div variants={fadeInUp} className="space-y-6 text-muted text-lg leading-relaxed mb-10">
                  <p>
                    Abundance Blueprint is for anyone who has ever felt behind with money and couldn&apos;t explain why. Part memoir, part financial education, it is one CPA&apos;s honest account of the story beneath the spending, debt, hustle, and exhaustion — and how to build something steadier on top of it.
                  </p>
                  <p>
                    From food stamps to financial freedom — through a CPA license, a loan modification, twenty years of client work, and a woman named Ms. Ruth who co-signed a car when it mattered most — La&apos;Toya&apos;s journey is both deeply personal and universally recognizable.
                  </p>
                </motion.div>

                <motion.div variants={fadeInUp} className="bg-card p-6 rounded-xl border border-card-border mb-10">
                  <h3 className="font-sans font-medium text-sm tracking-widest uppercase mb-4 text-primary">Available Formats</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex justify-between items-center border-b border-border pb-2">
                      <span className="text-muted">Paperback</span>
                      <span className="font-medium text-primary">$21.99</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-border pb-2">
                      <span className="text-muted">Hardcover</span>
                      <span className="font-medium text-primary">$29.99</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-border pb-2">
                      <span className="text-muted">Ebook</span>
                      <span className="font-medium text-primary">$9.99</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-border pb-2">
                      <span className="text-muted">Audiobook</span>
                      <span className="font-medium text-primary">$24.99</span>
                    </div>
                  </div>
                  <Button
                    asChild
                    className="w-full bg-primary text-primary-foreground text-lg py-6"
                    data-testid="link-preorder"
                  >
                    <a
                      href={KIT_BOOK_LAUNCH_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Join the Book Launch List
                    </a>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Back Cover & Value Prop */}
        <section className="py-24 bg-card">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="order-2 lg:order-1"
              >
                <motion.h3 variants={fadeInUp} className="font-serif text-3xl md:text-4xl text-primary mb-8">
                  From the back cover
                </motion.h3>
                <motion.div variants={fadeInUp} className="space-y-6 text-muted text-lg leading-relaxed">
                  <p className="font-serif text-xl md:text-2xl text-primary">
                    You didn&apos;t learn about money in a classroom.
                  </p>
                  <p>
                    You learned it in the silences at the dinner table, in the instability you normalized, in the responsibilities you carried too early — and in the survival patterns that followed you long after the crisis ended. Until those patterns are examined, no budget, debt payoff plan, or raise will be enough.
                  </p>
                  <p>
                    <em>Abundance Blueprint</em> is for anyone who has ever felt behind with money and couldn&apos;t explain why. Part memoir, part financial education, it is one CPA&apos;s honest account of the story beneath the spending, debt, hustle, and exhaustion — and how to build something steadier on top of it.
                  </p>
                  <p className="font-serif text-xl text-secondary italic">
                    &ldquo;Your past explains you. It does not confine you.&rdquo;
                  </p>
                </motion.div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="order-1 lg:order-2 relative max-w-md mx-auto w-full"
              >
                <img 
                  src={backCover} 
                  alt="Abundance Blueprint Back Cover" 
                  className="w-full h-auto drop-shadow-xl rounded-sm"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* In These Pages */}
        <section className="py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif text-3xl md:text-5xl mb-16 text-accent"
            >
              In These Pages, You Will:
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-8 text-left">
              {[
                "Trace your money story back to its roots and decide what no longer belongs in your future",
                "Build a practical financial foundation without shame, fear, or perfectionism",
                "Use debt, taxes, and real estate as tools instead of traps — the way a CPA does",
                "Redefine wealth as time, peace, and the people you build with — not just a number",
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-primary-foreground/5 p-8 rounded-xl border border-primary-foreground/10 flex gap-4"
                >
                  <div className="text-secondary mt-1">✦</div>
                  <p className="text-lg leading-relaxed text-primary-foreground/90">{item}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
