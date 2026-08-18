import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { postsTable } from "./posts";

export const commentStatuses = ["pending", "approved", "rejected"] as const;
export type CommentStatus = (typeof commentStatuses)[number];

export const commentsTable = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id")
    .notNull()
    .references(() => postsTable.id, { onDelete: "cascade" }),
  authorName: text("author_name").notNull(),
  authorEmail: text("author_email").notNull(),
  body: text("body").notNull(),
  status: text("status").$type<CommentStatus>().notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type InsertComment = typeof commentsTable.$inferInsert;
export type Comment = typeof commentsTable.$inferSelect;
