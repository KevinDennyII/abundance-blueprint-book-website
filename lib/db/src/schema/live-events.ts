import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const liveEventsTable = pgTable("live_events", {
  id: serial("id").primaryKey(),
  showOnSite: boolean("show_on_site").notNull().default(false),
  /** ISO calendar date YYYY-MM-DD (no timezone). */
  eventDate: text("event_date").notNull(),
  time: text("time").notNull().default(""),
  type: text("type").notNull().default(""),
  title: text("title").notNull(),
  venue: text("venue").notNull().default(""),
  address: text("address").notNull().default(""),
  cityState: text("city_state").notNull().default(""),
  price: text("price").notNull().default(""),
  rsvpLink: text("rsvp_link").notNull().default(""),
  /** Shared id for occurrences expanded from a repeating create. */
  seriesId: text("series_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type InsertLiveEvent = typeof liveEventsTable.$inferInsert;
export type LiveEventRow = typeof liveEventsTable.$inferSelect;
