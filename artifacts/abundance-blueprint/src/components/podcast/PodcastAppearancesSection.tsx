import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePageMotion } from "@/lib/page-motion";
import {
  fetchPodcastAppearances,
  formatAppearanceDate,
  parseSafePodcastEmbed,
  type PodcastAppearance,
} from "@/lib/podcast-appearances";

function AppearanceCard({ appearance }: { appearance: PodcastAppearance }) {
  const embed = parseSafePodcastEmbed(
    appearance.embedCode,
    `${appearance.showName}: ${appearance.episodeTitle}`,
  );
  const dateLabel = formatAppearanceDate(appearance.publishedDate);

  if (embed) {
    return (
      <article className="bg-background rounded-2xl px-6 py-6 md:px-7 md:py-7 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <p className="font-sans text-sm font-bold uppercase tracking-[0.14em] text-primary m-0">
            {appearance.showName}
          </p>
          <h3 className="font-serif text-2xl font-semibold text-primary leading-snug m-0">
            {appearance.episodeTitle}
          </h3>
          {dateLabel ? (
            <p className="font-sans text-sm text-muted m-0">{dateLabel}</p>
          ) : null}
          {appearance.description ? (
            <p className="font-sans text-base leading-relaxed text-foreground m-0 mt-1">
              {appearance.description}
            </p>
          ) : null}
        </div>
        <div className="overflow-hidden rounded-xl bg-card">
          <iframe
            title={embed.title}
            src={embed.src}
            height={embed.height}
            className="w-full border-0"
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
        {appearance.episodeLink ? (
          <a
            href={appearance.episodeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-sm font-semibold text-primary underline-offset-2 hover:underline w-fit"
          >
            Open episode
          </a>
        ) : null}
      </article>
    );
  }

  return (
    <article className="bg-background rounded-2xl px-6 py-6 md:px-7 md:py-6 flex flex-wrap items-center gap-6 md:gap-8">
      <div className="min-w-0 flex-1 basis-[22rem] flex flex-col gap-1.5">
        <p className="font-sans text-sm font-bold uppercase tracking-[0.14em] text-primary m-0">
          {appearance.showName}
        </p>
        <h3 className="font-serif text-2xl font-semibold text-primary leading-snug m-0">
          {appearance.episodeTitle}
        </h3>
        {dateLabel ? (
          <p className="font-sans text-sm text-muted m-0">{dateLabel}</p>
        ) : null}
        {appearance.description ? (
          <p className="font-sans text-base leading-relaxed text-foreground m-0 mt-1">
            {appearance.description}
          </p>
        ) : null}
      </div>
      {appearance.episodeLink ? (
        <a
          href={appearance.episodeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 shrink-0 items-center rounded-full bg-primary px-6 font-sans font-bold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Listen
        </a>
      ) : null}
    </article>
  );
}

/**
 * Self-contained section for published podcast appearances.
 * Hidden until at least one published entry exists.
 * Reuse on a future /as-heard-on page without re-entering data.
 */
export function PodcastAppearancesSection({
  heading = "Catch the conversation",
  sectionId = "podcast-appearances",
}: {
  heading?: string;
  sectionId?: string;
}) {
  const { fadeInUp, staggerContainer } = usePageMotion();
  const [appearances, setAppearances] = useState<PodcastAppearance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await fetchPodcastAppearances();
      if (cancelled) return;
      setAppearances(result.appearances);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || appearances.length === 0) {
    return null;
  }

  return (
    <section
      id={sectionId}
      className="bg-card py-20 md:py-28 scroll-mt-28"
      aria-label="Podcast Appearances"
    >
      <div className="container mx-auto px-4 md:px-6 max-w-5xl flex flex-col gap-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="flex flex-col gap-3"
        >
          <motion.p
            variants={fadeInUp}
            className="font-sans text-sm font-bold uppercase tracking-[0.16em] text-primary m-0"
          >
            Podcast Appearances
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] font-semibold text-primary leading-tight m-0"
          >
            {heading}
          </motion.h2>
        </motion.div>

        <div className="flex flex-col gap-4">
          {appearances.map((appearance) => (
            <AppearanceCard key={appearance.id} appearance={appearance} />
          ))}
        </div>
      </div>
    </section>
  );
}
