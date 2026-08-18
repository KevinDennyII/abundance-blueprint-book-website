import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageMeta } from "@/lib/seo";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PageMeta path="/about" />
      <Navbar />
      
      <main className="flex-1 pt-24">
        {/* Bio Header */}
        <section id="her-story" className="py-16 md:py-24 bg-card scroll-mt-28">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-3xl mx-auto text-center"
            >
              <motion.h1 variants={fadeInUp} className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary mb-6">
                La'Toya Ray
              </motion.h1>
              <motion.p variants={fadeInUp} className="font-sans text-sm tracking-widest uppercase text-muted mb-12">
                CPA · Financial Strategist · Real Estate Investor · Author
              </motion.p>
              
              <motion.div variants={fadeInUp} className="bg-background p-8 rounded-xl shadow-sm border border-border italic font-serif text-xl md:text-2xl text-primary mb-12">
                "Real wealth doesn't announce itself. It is peace. It is options. It is boundaries. It is rest. It looks different for everyone but it always feels like freedom."
              </motion.div>
              
              <div className="text-left space-y-6 text-muted text-lg leading-relaxed">
                <motion.p variants={fadeInUp}>
                  She knows that story from the inside. She grew up watching financial hardship shape not just households but nervous systems, relationships, and the decisions people make for decades afterward. Long before she became a CPA, she became the responsible one — the observer, the problem-solver, the one who figured things out because somebody had to. She carried that role into a career, and that career into this book.
                </motion.p>
                <motion.p variants={fadeInUp}>
                  La'Toya built a million-dollar real estate portfolio not because she had the right start but because she refused to let the wrong one be the final word. She did it through a CPA license earned during one of the hardest seasons of her life, a loan modification that bought her time, twenty years of client work that sharpened her strategy, and a woman named Ms. Ruth who co-signed a car when it mattered most. She is the founder of Long Money Concepts LLC and is pursuing certification in financial therapy — because she knows that sometimes the work of building wealth begins long before you open a spreadsheet.
                </motion.p>
                <motion.p variants={fadeInUp}>
                  She lives in Maryland with her husband and son.
                </motion.p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Philosophy */}
        <section className="py-24 bg-primary text-primary-foreground px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-sans text-sm tracking-widest uppercase text-accent mb-8"
            >
              Core Philosophy
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif text-2xl md:text-4xl leading-relaxed"
            >
              "True financial harmony is not about how much you accumulate. It is about understanding why you behave the way you do with money — healing what needs to be healed, building what needs to be built, and arriving at a life that feels whole from the inside rather than successful from the outside."
            </motion.p>
          </div>
        </section>

        {/* Five Beliefs */}
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="font-serif text-3xl md:text-5xl text-primary text-center mb-16">The Five Core Beliefs</h2>
            <div className="space-y-12">
              {[
                { num: "01", title: "Money is never just money.", text: "Every financial behavior has an emotional origin. The budget you won't look at, the debt you can't stop accumulating, the hustle you can't slow down — none of it is about math. It's about memory. It's about what you learned in the house you grew up in before you had language for what you were learning. You cannot fix what you haven't examined." },
                { num: "02", title: "The past explains you. It doesn't have to confine you.", text: "You inherited patterns. Those patterns were reasonable responses to the circumstances that produced them. They kept you functioning when you needed them to. But inherited patterns don't automatically update when the circumstances change. That update is deliberate work — belief by belief, decision by decision, one act of evidence at a time." },
                { num: "03", title: "Survival mode is not a character flaw. It is a program that can be rewritten.", text: "The hypervigilance, the avoidance, the hustle addiction, the emotional spending — these are not failures of discipline or intelligence. They are adaptive responses to financial instability that became default settings. You don't shame people out of survival mode. You show them what the exit looks like and walk alongside them as they take it." },
                { num: "04", title: "Wealth is bought-back time, not just accumulated money.", text: "The portfolio matters. The net worth matters. But wealth is not only a number — it is what the number produces. Options. Time. Peace. The ability to make decisions from alignment instead of fear. The everyday millionaire is not defined by a threshold. She is defined by what she can choose. Build the assets. And build the life they were meant to fund. One without the other is an incomplete definition of wealth." },
                { num: "05", title: "You do not build alone — and you do not heal alone.", text: "No one who has built anything real built it without someone who believed in them before the evidence was there. Receive that generosity with gratitude. Pass it forward with intention. That is how cycles break — not through individual heroism but through a chain of people who chose to open doors for each other." }
              ].map((belief, i) => (
                <motion.div 
                  key={belief.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-col md:flex-row gap-6 md:gap-12 items-start"
                >
                  <span className="font-serif text-5xl text-secondary/50 font-light">{belief.num}</span>
                  <div>
                    <h3 className="font-serif text-2xl text-primary mb-4">{belief.title}</h3>
                    <p className="text-muted leading-relaxed">{belief.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* HEALS Framework */}
        <section id="heals-framework" className="py-24 bg-card px-4 scroll-mt-28">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-5xl text-primary mb-6">The HEALS™ Framework</h2>
              <p className="text-muted text-lg">Five Pillars of Financial Harmony</p>
            </div>

            <div className="space-y-12">
              {[
                { letter: "H", title: "Honor the Story You Inherited", text: "Before you can change your relationship with money, you have to see where it began. The family silence around finances. The scripts you absorbed before you had language for them. The patterns that felt like survival because they were. Honor the origin — not to stay there, but to understand what you're actually working with." },
                { letter: "E", title: "Educate Yourself With What You Were Never Taught", text: "Most people don't fail financially because they're unintelligent. They fail because nobody taught them the fundamentals — budgeting, debt, credit, investing, taxes, protection. That gap is not your fault. Closing it is your responsibility. And it is never too late to learn what you were never given." },
                { letter: "A", title: "Act Your Way Into New Beliefs", text: "Transformation doesn't arrive as a revelation. It arrives as evidence — one deliberate decision at a time. You don't think your way into a new financial identity. You build your way there, and the belief follows the behavior." },
                { letter: "L", title: "Live Inside What You Build", text: "Wealth is not a destination. It is bought-back time — the ability to go for a walk for no reason, to have lunch on a Tuesday, to be present in the life rather than perpetually funding it from the outside. Build toward the life, not just the number." },
                { letter: "S", title: "Sow Seeds — Receive and Pass Forward", text: "No one builds alone. Receive generosity with gratitude. Pass it forward with intention. The chain of people who opened doors for you is the same chain you extend when you open doors for someone else. That is how financial cycles break — not through individual heroism, but through people who choose to believe in each other." }
              ].map((pillar) => (
                <motion.div 
                  key={pillar.letter}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-background p-8 md:p-10 rounded-xl shadow-sm border border-border"
                >
                  <div className="flex items-center gap-6 mb-4">
                    <span className="font-serif text-6xl text-secondary">{pillar.letter}</span>
                    <h3 className="font-serif text-2xl md:text-3xl text-primary leading-tight">{pillar.title}</h3>
                  </div>
                  <p className="text-muted leading-relaxed pl-0 md:pl-[5.5rem]">{pillar.text}</p>
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
