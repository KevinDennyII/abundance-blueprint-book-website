import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Editable SEO metadata for fixed public routes (e.g. "/", "/about").
 * Blog posts store their own meta on the posts table.
 */
export const pageMetaTable = pgTable("page_meta", {
  id: serial("id").primaryKey(),
  path: text("path").notNull().unique(),
  title: text("title").notNull().default(""),
  description: text("description").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type InsertPageMeta = typeof pageMetaTable.$inferInsert;
export type PageMeta = typeof pageMetaTable.$inferSelect;
