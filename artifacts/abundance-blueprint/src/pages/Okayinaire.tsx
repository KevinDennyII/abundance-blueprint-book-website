import { useEffect, useRef, useState, type SyntheticEvent } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageMeta } from "@/lib/seo";
import {
  KIT_OKAYINAIRE_EMBED_URL,
  OKAYINAIRE_URBAN_DICTIONARY_URL,
} from "@/lib/social";
import { submitKitForm } from "@/lib/kit-form";
import "./Okayinaire.css";

const QUIZ_QUESTIONS = [
  "1. Is your net worth $1 million or more, counting investments, real estate, and retirement accounts?",
  "2. Could your investments or passive income cover your basic living expenses?",
  "3. Do you work mainly to fund your lifestyle, not to keep the lights on?",
  "4. Would a few years of unplanned luxury spending still put a real dent in your plans?",
  "5. When someone calls you \"rich,\" does it feel like the wrong word?",
] as const;

type QuizResult = { title: string; text: string };

function scoreQuiz(answers: Record<number, number>): QuizResult {
  const score = Object.values(answers).reduce((sum, v) => sum + v, 0);
  if (answers[0] === 1 && score >= 4) {
    return {
      title: "You're an okayinaire.",
      text: "You've built real freedom: the basics are covered and your time is yours. Now the goal is protecting and growing it.",
    };
  }
  if (score >= 2) {
    return {
      title: "You're on your way.",
      text: "You have pieces of the okayinaire life in place. The next step is getting your investments to cover your basic expenses.",
    };
  }
  return {
    title: "Your okayinaire journey starts here.",
    text: "Every okayinaire started at zero. Join the newsletter below for the first steps.",
  };
}

/**
 * Kit form 10086596 (UID ae4843bb11). Prefer the server subscribe path so the
 * page keeps its own signup chrome; fall back to the Kit embed script if needed.
 */
function OkayinaireSignup() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useEmbed, setUseEmbed] = useState(false);
  const embedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!useEmbed || !embedRef.current) return;
    const container = embedRef.current;
    if (container.querySelector("script")) return;

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-uid", "ae4843bb11");
    script.src = KIT_OKAYINAIRE_EMBED_URL;
    container.appendChild(script);

    return () => {
      script.remove();
      container.replaceChildren();
    };
  }, [useEmbed]);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await submitKitForm(email, "okayinaire", {
      firstName: firstName.trim() || undefined,
    });

    setIsSubmitting(false);

    if (result.ok) {
      setSubmitted(true);
      setEmail("");
      setFirstName("");
      return;
    }

    // If the new form ID isn't in secrets yet, drop to the Kit embed.
    if (/not configured/i.test(result.error)) {
      setUseEmbed(true);
      return;
    }

    setError(result.error);
  };

  return (
    <div className="okay-signup">
      <h2>Become an okayinaire</h2>
      <p style={{ margin: "0 auto", maxWidth: 520 }}>
        Get the Long Money Concepts newsletter: practical steps for building
        wealth that buys back your time.
      </p>

      {useEmbed ? (
        <div className="okay-kit-embed" ref={embedRef} />
      ) : submitted ? (
        <div className="okay-signup-success">
          <p>
            You’re in. Welcome to the okayinaires. Watch your inbox for your
            first letter. If you don’t see it, check your Promotions folder and
            drag it to your main inbox.
          </p>
        </div>
      ) : (
        <form className="okay-signup-fields" onSubmit={handleSubmit}>
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            aria-label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            autoComplete="given-name"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            aria-label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <button className="okay-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting…" : "Count me in!"}
          </button>
          {error ? (
            <p className="okay-signup-error" role="alert">
              {error}
            </p>
          ) : null}
          <p style={{ margin: "4px 0 0", fontSize: 13, opacity: 0.75 }}>
            We respect your privacy. Unsubscribe at anytime.
          </p>
        </form>
      )}
    </div>
  );
}

export default function Okayinaire() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [shareLabel, setShareLabel] = useState("Share this word");

  const allAnswered = Object.keys(answers).length === QUIZ_QUESTIONS.length;
  const result = allAnswered ? scoreQuiz(answers) : null;

  const handleShare = async () => {
    const data = {
      title: "Okayinaire",
      text: "okayinaire (n.): a millionaire on paper who is comfortable, not rich.",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch {
        /* user cancelled */
      }
      return;
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(`${data.text} ${data.url}`);
      setShareLabel("Link copied!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PageMeta path="/okayinaire" />
      <Navbar />

      <main className="flex-1 pt-28 md:pt-32">
        <div className="okay-page">
          <header className="okay-hero">
            <div className="okay-wrap">
              <div className="okay-eyebrow">
                A new word from Long Money Concepts
              </div>
              <h1>okayinaire</h1>
              <div className="okay-pron">
                oh-kay-in-AIR <em>noun</em>
              </div>
              <p className="okay-def">
                A person whose net worth reaches $1 million or more on paper,
                but who is financially comfortable rather than rich. Their
                investments cover basic living expenses, and they work by choice
                to fund lifestyle extras.
              </p>
              <p className="okay-example">
                &ldquo;People hear &lsquo;millionaire&rsquo; and think yachts.
                We&rsquo;re okayinaires — the bills are handled, and we bought
                back our time.&rdquo;
              </p>
              <p className="okay-ud">
                Also listed in{" "}
                <a
                  href={OKAYINAIRE_URBAN_DICTIONARY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Urban Dictionary
                </a>
              </p>
            </div>
          </header>

          <section className="okay-section">
            <div className="okay-wrap">
              <h2>Why we made up a word</h2>
              <p>
                People hear &ldquo;millionaire&rdquo; and picture private jets
                and never worrying about money again. That isn&rsquo;t the life
                $1 million buys anymore.
              </p>
              <p>
                In the 1990s, a million dollars made you rich. Today, it makes
                you <em>okay</em>. It covers a modest lifestyle. It means your
                investments handle your basic living expenses, so you no longer
                have to work 40 hours a week. You still work, but you work for
                your lifestyle, not your survival.
              </p>
              <p>
                That&rsquo;s real freedom. It just isn&rsquo;t &ldquo;rich.&rdquo;
                Damien and I needed a word for it, so we made one up:{" "}
                <strong>okayinaire</strong>.
              </p>
              <p>
                Why we needed that word is a longer story. It&rsquo;s in the
                book.
              </p>
              <p>— LaToya Ray, founder of Long Money Concepts</p>
              <p>
                <Link href="/book" className="okay-book-link">
                  Read Abundance Blueprint →
                </Link>
              </p>
            </div>
          </section>

          <section className="okay-section">
            <div className="okay-wrap">
              <h2>Why $1 million isn&rsquo;t &ldquo;rich&rdquo; anymore</h2>
              <p>Inflation quietly changed what a million dollars means.</p>
              <div className="okay-stats">
                <div className="okay-stat">
                  <strong>~40%</strong>
                  <span>
                    Roughly what $1M today would have bought in 1990
                  </span>
                </div>
                <div className="okay-stat">
                  <strong>~$40K</strong>
                  <span>
                    Yearly income from $1M using the common 4% withdrawal
                    guideline
                  </span>
                </div>
                <div className="okay-stat">
                  <strong>Time</strong>
                  <span>
                    What $1M really buys today: freedom from working just to
                    survive
                  </span>
                </div>
              </div>
              <p className="okay-note">
                Figures are rounded estimates for illustration, based on U.S.
                consumer price changes since 1990 and a common
                retirement-planning rule of thumb. Not financial advice.
              </p>

              <div className="okay-compare">
                <div className="okay-card">
                  <h3>Millionaire (1990)</h3>
                  <ul>
                    <li>Considered truly wealthy</li>
                    <li>Could stop working entirely</li>
                    <li>Luxury lifestyle within reach</li>
                  </ul>
                </div>
                <div className="okay-card is-feature">
                  <h3>Okayinaire (today)</h3>
                  <ul>
                    <li>Comfortable, not rich</li>
                    <li>Investments cover the basics</li>
                    <li>Works by choice, for lifestyle extras</li>
                    <li>Has bought back a lot of time</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="okay-section">
            <div className="okay-wrap">
              <h2>Are you an okayinaire?</h2>
              <p>Answer five quick questions.</p>

              <div className="okay-quiz">
                {QUIZ_QUESTIONS.map((question, i) => (
                  <div className="okay-q" key={question}>
                    <p>{question}</p>
                    <div className="okay-opts">
                      {[
                        { label: "Yes", value: 1 },
                        { label: "No", value: 0 },
                      ].map((opt) => (
                        <button
                          key={opt.label}
                          type="button"
                          className={
                            answers[i] === opt.value ? "is-on" : undefined
                          }
                          onClick={() =>
                            setAnswers((prev) => ({ ...prev, [i]: opt.value }))
                          }
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {result ? (
                  <div className="okay-result">
                    <h3>{result.title}</h3>
                    <p style={{ margin: 0 }}>{result.text}</p>
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          <section className="okay-section" id="okay-signup">
            <div className="okay-wrap">
              <OkayinaireSignup />

              <p className="okay-share" style={{ textAlign: "center" }}>
                Know an okayinaire?{" "}
                <button type="button" onClick={handleShare}>
                  {shareLabel}
                </button>
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
