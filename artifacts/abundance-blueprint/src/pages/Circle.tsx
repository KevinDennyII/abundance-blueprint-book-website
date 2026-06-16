import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EmailSignup } from "@/components/EmailSignup";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

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
                A free community for your financial healing journey.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="text-left space-y-6 text-muted text-lg leading-relaxed mb-16"
              >
                <p>
                  Money is never just math. There's life beneath the numbers —
                  and that's exactly what we talk about here.
                </p>
                <p>
                  The Long Money Circle is a free community hosted by La'Toya
                  Ray, CPA and author of Abundance Blueprint: A Journey to
                  Financial Harmony. We gather to do the honest work of building
                  financial wellness — together. This is not a space for shame
                  or hustle. It's a space for healing, growth, and
                  accountability.
                </p>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <EmailSignup form="circle" />
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
