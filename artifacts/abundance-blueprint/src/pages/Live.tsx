import { useEffect, useState, type SyntheticEvent } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePageMotion } from "@/lib/page-motion";
import { PageMeta } from "@/lib/seo";
import { submitKitForm } from "@/lib/kit-form";
import {
  fetchLiveEvents,
  formatEventDay,
  formatEventMonth,
  formatEventWhen,
  googleMapsUrl,
  type LiveEvent,
} from "@/lib/live-events";
import {
  KIT_LIVE_TAG,
  KIT_WEEKLY_PULSE_PERSONAL_FORM_URL,
  LIVE_HOSTING_EMAIL,
  LIVE_HOSTING_MAILTO,
} from "@/lib/social";

const pillars = [
  {
    title: "It's free.",
    body: "No cost to attend and nothing to buy. There's no sales pitch at the end.",
  },
  {
    title: "It's honest.",
    body: "We talk about the money lessons we picked up growing up, the ones we were told and the ones we just watched. You only share what you want to.",
  },
  {
    title: "You leave with something.",
    body: "A worksheet to take home and one simple weekly habit you can start the very next day.",
  },
] as const;

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function EventRow({ event }: { event: LiveEvent }) {
  const mapsUrl = googleMapsUrl(event);
  const when = formatEventWhen(event.date, event.time);
  const whereLine = [when, event.cityState].filter(Boolean).join(" · ");
  const addressLine = [event.address, event.cityState]
    .filter((part) => part.trim())
    .join(", ");

  return (
    <article className="bg-background rounded-2xl px-6 py-6 md:px-7 md:py-6 flex flex-wrap items-center gap-6 md:gap-8">
      <div className="flex h-24 w-24 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl bg-primary text-primary-foreground">
        <span className="font-sans text-sm font-bold uppercase tracking-[0.14em] text-accent">
          {formatEventMonth(event.date)}
        </span>
        <span className="font-serif text-4xl font-semibold leading-none">
          {formatEventDay(event.date)}
        </span>
      </div>

      <div className="min-w-0 flex-1 basis-[22rem] flex flex-col gap-1.5">
        <div className="flex flex-wrap gap-2">
          {event.type ? (
            <span className="rounded-full bg-primary px-3 py-1 font-sans text-xs font-bold tracking-wide text-primary-foreground">
              {event.type}
            </span>
          ) : null}
          {event.price ? (
            <span className="rounded-full bg-card px-3 py-1 font-sans text-xs font-bold tracking-wide text-primary">
              {event.price}
            </span>
          ) : null}
        </div>
        <h3 className="font-serif text-2xl font-semibold text-primary leading-snug mt-1">
          {event.title}
        </h3>
        {event.venue ? (
          <p className="font-sans text-base font-semibold text-foreground">
            {event.venue}
          </p>
        ) : null}
        {addressLine ? (
          mapsUrl ? (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm text-muted underline-offset-2 hover:underline hover:text-primary"
            >
              {addressLine}
            </a>
          ) : (
            <p className="font-sans text-sm text-muted">{addressLine}</p>
          )
        ) : null}
        {whereLine ? (
          <p className="font-sans text-base text-muted">{whereLine}</p>
        ) : null}
      </div>

      {event.rsvpLink ? (
        <a
          href={event.rsvpLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 shrink-0 items-center rounded-full bg-primary px-6 font-sans font-bold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Details &amp; RSVP
        </a>
      ) : null}
    </article>
  );
}

function LiveWaitlistForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await submitKitForm(email, "live", {
      tag: KIT_LIVE_TAG,
    });

    setIsSubmitting(false);

    if (result.ok) {
      setSubmitted(true);
      setEmail("");
      return;
    }

    setError(result.error);
  };

  if (submitted) {
    return (
      <div className="flex-1 basis-[23rem] rounded-xl border border-accent/30 bg-accent/10 px-5 py-4 text-center">
        <p className="font-serif text-xl text-primary mb-1">Got it, thank you.</p>
        <p className="font-sans text-sm text-muted">
          We&apos;ll let you know when new dates are set.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex-1 basis-[23rem] flex flex-wrap items-end gap-3"
    >
      <div className="flex min-w-[14rem] flex-1 flex-col gap-1.5">
        <label
          htmlFor="lml-email"
          className="font-sans text-sm font-semibold text-primary"
        >
          Email address
        </label>
        <Input
          id="lml-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="min-h-12 bg-white text-base"
          data-testid="input-email-signup-live"
        />
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="min-h-12 rounded-full px-7 font-bold"
        data-testid="button-email-submit-live"
      >
        {isSubmitting ? "Submitting..." : "Let me know"}
      </Button>
      {error ? (
        <p className="w-full text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}

export default function Live() {
  const { fadeInUp, staggerContainer } = usePageMotion();
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await fetchLiveEvents();
      if (cancelled) return;
      setEvents(result.events);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const showEvents = !loading && events.length > 0;
  const showEmpty = !loading && events.length === 0;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <PageMeta path="/live" />
      <Navbar />

      <main className="flex-1 pt-28 md:pt-32">
        {/* Hero — starts below the fixed nav so the cream page bg sits under the header */}
        <section className="bg-primary text-primary-foreground py-20 md:py-28">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="container mx-auto px-4 md:px-6 max-w-3xl flex flex-col items-center text-center gap-6"
          >
            <motion.p
              variants={fadeInUp}
              className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-accent m-0"
            >
              Long Money Live
            </motion.p>
            <motion.h1
              variants={fadeInUp}
              className="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] text-primary-foreground m-0"
            >
              Pull up a chair.
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="font-sans text-lg md:text-xl leading-relaxed text-primary-foreground/85 max-w-xl m-0"
            >
              Free, in-person conversations about the money lessons we inherited
              and the life we want to build. Join one near you, or bring one to
              your community.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap justify-center gap-4 mt-2"
            >
              <button
                type="button"
                onClick={() => scrollToId("upcoming")}
                className="inline-flex min-h-12 items-center rounded-full bg-accent px-7 font-sans text-base font-bold text-accent-foreground transition-colors hover:bg-accent/90"
              >
                See what&apos;s coming up
              </button>
              <button
                type="button"
                onClick={() => scrollToId("host")}
                className="inline-flex min-h-12 items-center rounded-full border-2 border-accent px-7 font-sans text-base font-bold text-accent transition-colors hover:bg-accent/10"
              >
                Bring one to your community
              </button>
            </motion.div>
          </motion.div>
        </section>

        {/* What it is */}
        <section className="bg-card py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl flex flex-col gap-12 md:gap-14">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={staggerContainer}
              className="max-w-2xl flex flex-col gap-5"
            >
              <motion.h2
                variants={fadeInUp}
                className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-primary leading-tight m-0"
              >
                A real conversation, not a lecture.
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="font-sans text-lg md:text-xl leading-relaxed text-foreground m-0"
              >
                Money is part of everyday life, so it shouldn&apos;t be the one
                thing we avoid talking about. Long Money Live brings people
                together in libraries, churches, and community spaces to talk
                honestly about where our money habits came from and what we want
                to do with them now.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {pillars.map((pillar) => (
                <motion.div
                  key={pillar.title}
                  variants={fadeInUp}
                  className="bg-background rounded-2xl p-8 flex flex-col gap-3"
                >
                  <h3 className="font-serif text-2xl font-semibold text-primary m-0">
                    {pillar.title}
                  </h3>
                  <p className="font-sans text-base leading-relaxed text-foreground m-0">
                    {pillar.body}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Featured workshop */}
        <section className="bg-background py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={staggerContainer}
              className="flex flex-wrap gap-10 md:gap-12 items-start"
            >
              <motion.div
                variants={fadeInUp}
                className="flex-1 basis-80 flex flex-col gap-4"
              >
                <p className="font-sans text-sm font-bold uppercase tracking-[0.16em] text-primary m-0">
                  Featured workshop
                </p>
                <h2 className="font-serif text-3xl md:text-4xl font-semibold text-primary leading-snug m-0">
                  There&apos;s Life Beneath the Numbers
                </h2>
                <p className="font-sans text-xl italic leading-snug text-foreground m-0">
                  Why we do what we do with money
                </p>
                <div className="flex flex-wrap gap-2.5 mt-2">
                  {["About 60 minutes", "Free", "In person"].map((label) => (
                    <span
                      key={label}
                      className="rounded-full bg-card px-4 py-2 font-sans text-sm font-semibold text-primary"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </motion.div>
              <motion.div
                variants={fadeInUp}
                className="flex-[1.4] basis-[26rem] flex flex-col gap-5"
              >
                <p className="font-serif text-2xl md:text-[1.6rem] leading-snug text-primary m-0">
                  &ldquo;Whose definition of financial success have you been
                  living by?&rdquo;
                </p>
                <p className="font-sans text-lg leading-relaxed text-foreground m-0">
                  That&apos;s the question we start with. From there, we look at
                  the money stories we were handed, how they still show up in the
                  choices we make today, and what it could look like to write our
                  own.
                </p>
                <p className="font-sans text-lg leading-relaxed text-foreground m-0">
                  You don&apos;t need to be good with numbers. You just need to
                  be curious about your own story.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Upcoming */}
        <section id="upcoming" className="bg-card py-20 md:py-28 scroll-mt-28">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl flex flex-col gap-10">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-primary leading-tight m-0"
            >
              What&apos;s coming up
            </motion.h2>

            {loading ? (
              <p className="font-sans text-muted">Loading dates…</p>
            ) : null}

            {showEvents ? (
              <div className="flex flex-col gap-4">
                {events.map((event) => (
                  <EventRow
                    key={`${event.date}-${event.title}-${event.venue}-${event.time}`}
                    event={event}
                  />
                ))}
              </div>
            ) : null}

            {showEmpty ? (
              <div className="bg-background rounded-2xl px-8 py-10 flex flex-wrap gap-8 items-center">
                <div className="flex-1 basis-[22rem] flex flex-col gap-3">
                  <h3 className="font-serif text-2xl md:text-[1.6rem] font-semibold text-primary m-0">
                    New dates are on the way.
                  </h3>
                  <p className="font-sans text-lg leading-relaxed text-foreground m-0">
                    Leave your email and you&apos;ll be the first to know when a
                    conversation is set near you.
                  </p>
                </div>
                <LiveWaitlistForm />
              </div>
            ) : null}
          </div>
        </section>

        {/* Host */}
        <section
          id="host"
          className="bg-primary text-primary-foreground py-20 md:py-28 scroll-mt-28"
        >
          <div className="container mx-auto px-4 md:px-6 max-w-5xl flex flex-wrap gap-12 md:gap-14 items-start">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={staggerContainer}
              className="flex-[1.3] basis-[26rem] flex flex-col gap-5"
            >
              <motion.p
                variants={fadeInUp}
                className="font-sans text-sm font-bold uppercase tracking-[0.16em] text-accent m-0"
              >
                Host a conversation
              </motion.p>
              <motion.h2
                variants={fadeInUp}
                className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] font-semibold leading-tight text-primary-foreground m-0"
              >
                Bring Long Money Live to your community.
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="font-sans text-lg leading-relaxed text-primary-foreground/85 m-0"
              >
                Libraries, churches, and community groups can host a
                conversation. You bring the room and your people. I&apos;ll bring
                the conversation, the worksheets, and everything else.
              </motion.p>
              <motion.p
                variants={fadeInUp}
                className="font-sans text-lg leading-relaxed text-primary-foreground/85 m-0"
              >
                Reach out and we&apos;ll talk about what fits your group.
              </motion.p>
              <motion.div
                variants={fadeInUp}
                className="flex flex-col gap-2 mt-2"
              >
                <a
                  href={LIVE_HOSTING_MAILTO}
                  className="inline-flex min-h-12 w-fit items-center rounded-full bg-accent px-7 font-sans text-base font-bold text-accent-foreground transition-colors hover:bg-accent/90"
                >
                  Ask about hosting
                </a>
                <p className="font-sans text-base text-accent m-0">
                  {LIVE_HOSTING_EMAIL}
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="flex-1 basis-80 rounded-2xl bg-primary-foreground/10 px-9 py-9 flex flex-col gap-4"
            >
              <h3 className="font-serif text-2xl font-semibold text-accent m-0">
                What you&apos;ll need
              </h3>
              <ul className="m-0 pl-5 flex flex-col gap-3 font-sans text-lg leading-snug text-primary-foreground list-disc">
                <li>A room for about an hour</li>
                <li>Seats for your group</li>
                <li>A screen is nice, but not required</li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* Next step */}
        <section className="bg-background py-20 md:py-28">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="container mx-auto px-4 md:px-6 max-w-2xl flex flex-col items-center text-center gap-5"
          >
            <motion.h2
              variants={fadeInUp}
              className="font-serif text-3xl md:text-4xl font-semibold text-primary leading-snug m-0"
            >
              Can&apos;t make it in person yet?
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="font-sans text-lg leading-relaxed text-foreground m-0"
            >
              Start with the free Weekly Money Pulse, a simple weekly check-in
              that helps you see where your money is going and where you want it
              to go.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap justify-center gap-4 mt-3"
            >
              <a
                href={KIT_WEEKLY_PULSE_PERSONAL_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center rounded-full bg-primary px-7 font-sans text-base font-bold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Get the Weekly Pulse
              </a>
              <Link
                href="/library"
                className="inline-flex min-h-12 items-center rounded-full border-2 border-primary px-7 font-sans text-base font-bold text-primary transition-colors hover:bg-primary/5"
              >
                Browse the Library
              </Link>
            </motion.div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
