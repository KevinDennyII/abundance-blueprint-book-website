import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export function EmailSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-primary text-primary-foreground p-8 rounded-xl shadow-lg border border-primary-foreground/10">
      <div className="text-center mb-6">
        <h3 className="font-serif text-3xl mb-2 text-accent">Get Chapter 1 Free</h3>
        <p className="text-sm opacity-90 leading-relaxed font-sans">
          Join the list — be first to know when the book launches, get early access, and receive Chapter 1 as a gift.
        </p>
      </div>

      {submitted ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-4 bg-accent/10 rounded-lg border border-accent/20"
        >
          <p className="font-serif text-xl text-accent mb-1">Thank you.</p>
          <p className="text-sm opacity-80">Chapter 1 is on its way to your inbox.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input 
            type="email" 
            placeholder="Your email address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-background/10 border-background/20 text-white placeholder:text-white/50 focus-visible:ring-accent"
            data-testid="input-email-signup"
          />
          <Button 
            type="submit" 
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-medium transition-colors"
            data-testid="button-email-submit"
          >
            Send Me Chapter 1
          </Button>
          <p className="text-xs text-center opacity-60 mt-1">No spam. Just signal.</p>
        </form>
      )}
    </div>
  );
}
