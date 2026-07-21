import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitContactForm } from "@/lib/contact-form";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/social";
import { useState } from "react";
import { motion } from "framer-motion";

const initialForm = {
  name: "",
  email: "",
  message: "",
};

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await submitContactForm(form);

    setIsSubmitting(false);

    if (result.ok) {
      setSubmitted(true);
      setForm(initialForm);
      return;
    }

    setError(result.error);
  };

  const handleSendAnother = () => {
    setSubmitted(false);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      
      <main className="flex-1 pt-24">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16">
              
              {/* Info Column */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="font-serif text-4xl md:text-5xl text-primary mb-6">Work With Me</h1>
                <p className="text-muted text-lg leading-relaxed mb-12">
                  Whether you're interested in speaking engagements, bulk book orders, or exploring how we might work together — services are coming soon. For now, send a message and let's start the conversation.
                </p>

                <div className="space-y-8">
                  <div>
                    <h3 className="font-sans font-medium text-sm tracking-widest uppercase mb-2 text-primary">Social</h3>
                    <a
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary hover:text-primary transition-colors text-lg"
                      data-testid="link-contact-social"
                    >
                      {INSTAGRAM_HANDLE}
                    </a>
                  </div>
                  
                  <div>
                    <h3 className="font-sans font-medium text-sm tracking-widest uppercase mb-2 text-primary">Publisher</h3>
                    <p className="text-muted text-lg">Long Money Concepts LLC</p>
                    <p className="text-muted/70 italic mt-1">"Educate. Empower. Build Legacy."</p>
                  </div>
                </div>
              </motion.div>

              {/* Form Column */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-card p-8 rounded-2xl border border-card-border shadow-sm"
              >
                {submitted ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 bg-secondary/20 text-secondary rounded-full flex items-center justify-center mb-6 text-2xl">
                      ✓
                    </div>
                    <h3 className="font-serif text-3xl text-primary mb-2">Message Sent</h3>
                    <p className="text-muted">Thank you for reaching out. We will get back to you shortly.</p>
                    <Button 
                      variant="outline" 
                      className="mt-8"
                      onClick={handleSendAnother}
                    >
                      Send another message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-primary mb-2">Name</label>
                      <Input
                        id="name"
                        name="name"
                        required
                        value={form.name}
                        onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
                        className="bg-background"
                        data-testid="input-contact-name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">Email</label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
                        className="bg-background"
                        data-testid="input-contact-email"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-primary mb-2">Message</label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={form.message}
                        onChange={(e) => setForm((current) => ({ ...current, message: e.target.value }))}
                        className="bg-background min-h-[150px]"
                        data-testid="input-contact-message"
                      />
                    </div>
                    {error ? (
                      <p className="text-sm text-destructive" role="alert" data-testid="contact-form-error">
                        {error}
                      </p>
                    ) : null}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg"
                      data-testid="button-contact-submit"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                )}
              </motion.div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
