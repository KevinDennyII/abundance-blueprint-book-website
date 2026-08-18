import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const postStatuses = ["draft", "published"] as const;
export type PostStatus = (typeof postStatuses)[number];

export const postsTable = pgTable("posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull().default(""),
  body: text("body").notNull().default(""),
  status: text("status").$type<PostStatus>().notNull().default("draft"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type InsertPost = typeof postsTable.$inferInsert;
export type Post = typeof postsTable.$inferSelect;
