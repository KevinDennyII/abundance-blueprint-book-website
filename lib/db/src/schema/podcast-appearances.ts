import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const podcastAppearanceStatuses = ["draft", "published"] as const;
export type PodcastAppearanceStatus =
  (typeof podcastAppearanceStatuses)[number];

export const podcastAppearancesTable = pgTable("podcast_appearances", {
  id: serial("id").primaryKey(),
  showName: text("show_name").notNull(),
  episodeTitle: text("episode_title").notNull(),
  /** ISO calendar date YYYY-MM-DD (no timezone). */
  publishedDate: text("published_date").notNull(),
  episodeLink: text("episode_link").notNull().default(""),
  /** Raw Spotify/YouTube iframe markup; optional. */
  embedCode: text("embed_code").notNull().default(""),
  description: text("description").notNull().default(""),
  status: text("status")
    .$type<PodcastAppearanceStatus>()
    .notNull()
    .default("draft"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type InsertPodcastAppearance =
  typeof podcastAppearancesTable.$inferInsert;
export type PodcastAppearanceRow =
  typeof podcastAppearancesTable.$inferSelect;
