import { relations } from "drizzle-orm";
import { commentsTable } from "./comments";
import { postsTable } from "./posts";

export const postsRelations = relations(postsTable, ({ many }) => ({
  comments: many(commentsTable),
}));

export const commentsRelations = relations(commentsTable, ({ one }) => ({
  post: one(postsTable, {
    fields: [commentsTable.postId],
    references: [postsTable.id],
  }),
}));
