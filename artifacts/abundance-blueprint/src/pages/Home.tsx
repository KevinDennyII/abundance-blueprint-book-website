import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EmailSignup } from "@/components/EmailSignup";
import { motion } from "framer-motion";
import { Link } from "wouter";
import frontCover from "@assets/AB_Front_Cover_1779852599997.png";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="max-w-xl"
              >
                <motion.span
                  variants={fadeInUp}
                  className="inline-block py-1 px-3 rounded-full bg-secondary/20 text-secondary-foreground text-sm font-medium tracking-wider uppercase mb-6"
                >
                  New Release
                </motion.span>
                <motion.h1
                  variants={fadeInUp}
                  className="text-4xl md:text-5xl lg:text-6xl font-serif text-primary leading-tight mb-6"
                >
                  Heal Your Past. <br />
                  <span className="text-secondary">
                    Build Your Foundation.
                  </span>{" "}
                  <br />
                  Create Financial Harmony.
                </motion.h1>
                <motion.p
                  variants={fadeInUp}
                  className="text-lg text-muted mb-8 leading-relaxed"
                >
                  A memoir-driven guide to healing the story beneath the
                  spending, debt, hustle, fear, and financial exhaustion.
                </motion.p>
                <motion.div variants={fadeInUp}>
                  <EmailSignup />
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative mx-auto max-w-sm md:max-w-md lg:max-w-lg"
              >
                <div className="absolute -inset-4 bg-gradient-to-tr from-secondary/20 to-primary/20 blur-2xl rounded-full opacity-70" />
                <img
                  src={frontCover}
                  alt="Abundance Blueprint Book Cover"
                  className="w-full h-auto drop-shadow-2xl relative z-10 rounded-sm"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="py-24 bg-primary text-primary-foreground text-center px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="max-w-4xl mx-auto"
          >
            <p className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight mb-8 text-accent italic">
              "The past explains you. It doesn't have to confine you."
            </p>
            <p className="font-sans tracking-widest uppercase text-sm opacity-80">
              — La'Toya Ray, CPA
            </p>
          </motion.div>
        </section>

        {/* Framework Teaser */}
        <section className="py-24 bg-card px-4">
          <div className="container mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <motion.h2
                variants={fadeInUp}
                className="font-serif text-3xl md:text-5xl text-primary mb-6"
              >
                The HEALS™ Framework
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-muted text-lg">
                Five pillars of financial harmony built from the inside out.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {[
                {
                  letter: "H",
                  title: "Honor",
                  desc: "The Story You Inherited",
                },
                { letter: "E", title: "Educate", desc: "Yourself" },
                { letter: "A", title: "Act", desc: "Into New Beliefs" },
                { letter: "L", title: "Live", desc: "Inside What You Build" },
                { letter: "S", title: "Sow", desc: "Seeds" },
              ].map((item, i) => (
                <motion.div
                  key={item.letter}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-background p-8 rounded-xl shadow-sm border border-border text-center hover:border-secondary/50 transition-colors"
                >
                  <span className="font-serif text-5xl text-secondary block mb-4">
                    {item.letter}
                  </span>
                  <h3 className="font-serif text-xl text-primary mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/about"
                className="inline-block font-sans text-sm font-medium tracking-wide uppercase text-primary border-b border-primary pb-1 hover:text-secondary hover:border-secondary transition-colors"
              >
                Explore the Framework
              </Link>
            </div>
          </div>
        </section>

        {/* Author Teaser */}
        <section className="py-24 px-4">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-muted/10 aspect-square rounded-2xl flex items-center justify-center relative overflow-hidden"
              >
                {/* Fallback pattern/image space since no distinct author photo was provided outside the back cover */}
                <div className="absolute inset-0 bg-primary/5" />
                <div className="p-12 text-center relative z-10">
                  <p className="font-serif text-2xl text-primary italic opacity-60">
                    "True wealth is not performative. It is quiet peace."
                  </p>
                </div>
              </motion.div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="max-w-lg"
              >
                <motion.h2
                  variants={fadeInUp}
                  className="font-serif text-3xl md:text-4xl text-primary mb-6"
                >
                  Meet La'Toya Ray
                </motion.h2>
                <motion.p
                  variants={fadeInUp}
                  className="text-muted leading-relaxed mb-6"
                >
                  La'Toya Ray, CPA understands that money is never just about
                  numbers. Behind every bank statement, budget, debt balance,
                  and financial decision is a human story — one shaped by
                  survival, family dynamics, fear, identity, hope, and healing.
                </motion.p>
                <motion.p
                  variants={fadeInUp}
                  className="text-muted leading-relaxed mb-8"
                >
                  She built a million-dollar real estate portfolio from food
                  stamps, a loan modification, and a woman named Ms. Ruth who
                  co-signed a car.
                </motion.p>
                <motion.div variants={fadeInUp}>
                  <Link
                    href="/about"
                    className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors font-medium"
                  >
                    Read Her Story
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
