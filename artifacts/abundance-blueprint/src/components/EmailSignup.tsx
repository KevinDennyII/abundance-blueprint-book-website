import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { submitKitForm, type KitFormType } from "@/lib/kit-form";

type EmailSignupProps = {
  form?: KitFormType;
  title?: string;
  description?: string;
  buttonText?: string;
  reassurance?: string;
  successTitle?: string;
  successMessage?: string;
};

const defaults: Record<
  KitFormType,
  Required<
    Pick<
      EmailSignupProps,
      | "title"
      | "description"
      | "buttonText"
      | "reassurance"
      | "successTitle"
      | "successMessage"
    >
  >
> = {
  chapter1: {
    title: "Get Chapter 1 Free",
    description:
      "Join the list — be first to know when the book launches, get early access, and receive Chapter 1 as a gift.",
    buttonText: "Send Me Chapter 1",
    reassurance: "No spam. Just signal.",
    successTitle: "Thank you.",
    successMessage: "Chapter 1 is on its way to your inbox.",
  },
  circle: {
    title: "Join The Long Money Circle",
    description:
      "Enter your email to join the free community and start the conversation.",
    buttonText: "Join the Circle",
    reassurance: "It's free. No spam. Just real conversations about money and what's beneath it.",
    successTitle: "You're in.",
    successMessage: "Check your inbox for next steps from The Long Money Circle.",
  },
};

export function EmailSignup({
  form = "chapter1",
  title,
  description,
  buttonText,
  reassurance,
  successTitle,
  successMessage,
}: EmailSignupProps) {
  const copy = defaults[form];
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await submitKitForm(email, form);

    setIsSubmitting(false);

    if (result.ok) {
      setSubmitted(true);
      setEmail("");
      return;
    }

    setError(result.error);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-primary text-primary-foreground p-8 rounded-xl shadow-lg border border-primary-foreground/10">
      <div className="text-center mb-6">
        <h3 className="font-serif text-3xl mb-2 text-accent">
          {title ?? copy.title}
        </h3>
        <p className="text-sm opacity-90 leading-relaxed font-sans">
          {description ?? copy.description}
        </p>
      </div>

      {submitted ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-4 bg-accent/10 rounded-lg border border-accent/20"
        >
          <p className="font-serif text-xl text-accent mb-1">
            {successTitle ?? copy.successTitle}
          </p>
          <p className="text-sm opacity-80">
            {successMessage ?? copy.successMessage}
          </p>
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
            data-testid={`input-email-signup-${form}`}
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-medium transition-colors"
            data-testid={`button-email-submit-${form}`}
          >
            {isSubmitting ? "Submitting..." : (buttonText ?? copy.buttonText)}
          </Button>
          {error ? (
            <p className="text-xs text-center text-red-200" role="alert">
              {error}
            </p>
          ) : null}
          <p className="text-xs text-center opacity-60 mt-1">
            {reassurance ?? copy.reassurance}
          </p>
        </form>
      )}
    </div>
  );
}
