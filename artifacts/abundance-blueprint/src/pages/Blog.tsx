import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";

export default function Blog() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 pt-24">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary mb-6">
                Blog
              </h1>
              <p className="text-muted text-lg md:text-xl leading-relaxed mb-12">
                Stories, reflections, and practical notes on money, healing, and
                building a life of financial harmony — coming soon.
              </p>
              <div className="bg-card border border-card-border rounded-2xl p-10 md:p-14">
                <p className="font-serif text-2xl text-primary italic mb-4">
                  "Real wealth doesn't announce itself. It is quiet peace."
                </p>
                <p className="text-sm text-muted tracking-widest uppercase">
                  — La'Toya Ray, CPA
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
