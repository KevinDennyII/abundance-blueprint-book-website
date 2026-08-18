import { Router, type IRouter } from "express";
import { and, count, desc, eq } from "drizzle-orm";
import {
  commentsTable,
  db,
  postsTable,
  type CommentStatus,
  type PostStatus,
} from "@workspace/db";
import { isValidEmail, normalizeSlug } from "../lib/blog-utils";
import { isRateLimited } from "../lib/rate-limit";
import { requireAdmin, type AuthedRequest } from "../lib/require-admin";

const router: IRouter = Router();

function publicPostShape(post: typeof postsTable.$inferSelect) {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    body: post.body,
    status: post.status,
    metaTitle: post.metaTitle ?? null,
    metaDescription: post.metaDescription ?? null,
    publishedAt: post.publishedAt,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

const META_TITLE_MAX = 120;
const META_DESCRIPTION_MAX = 320;

/** Trim an optional meta field; empty string becomes null (use fallback). */
function parseMetaField(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().slice(0, max);
  return trimmed.length > 0 ? trimmed : null;
}

function publicCommentShape(comment: typeof commentsTable.$inferSelect) {
  return {
    id: comment.id,
    authorName: comment.authorName,
    body: comment.body,
    createdAt: comment.createdAt,
  };
}

/** Public: published posts list (paginated, 5 per page) */
router.get("/posts", async (req, res) => {
  const pageSize = 5;
  const rawPage = Number(req.query.page);
  const page =
    Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const offset = (page - 1) * pageSize;

  try {
    const [totalRow] = await db
      .select({ value: count() })
      .from(postsTable)
      .where(eq(postsTable.status, "published"));

    const total = totalRow?.value ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(page, totalPages);

    const posts = await db
      .select({
        id: postsTable.id,
        slug: postsTable.slug,
        title: postsTable.title,
        excerpt: postsTable.excerpt,
        publishedAt: postsTable.publishedAt,
        createdAt: postsTable.createdAt,
      })
      .from(postsTable)
      .where(eq(postsTable.status, "published"))
      .orderBy(desc(postsTable.publishedAt), desc(postsTable.createdAt))
      .limit(pageSize)
      .offset((safePage - 1) * pageSize);

    res.json({
      ok: true,
      posts,
      page: safePage,
      pageSize,
      total,
      totalPages: total === 0 ? 0 : totalPages,
    });
  } catch (err) {
    req.log?.error?.({ err }, "Failed to list posts");
    res.status(503).json({ ok: false, error: "Unable to load posts." });
  }
});

/** Public: published post + approved comments */
router.get("/posts/:slug", async (req, res) => {
  const slug = req.params.slug ?? "";

  try {
    const [post] = await db
      .select()
      .from(postsTable)
      .where(
        and(eq(postsTable.slug, slug), eq(postsTable.status, "published")),
      )
      .limit(1);

    if (!post) {
      res.status(404).json({ ok: false, error: "Post not found." });
      return;
    }

    const comments = await db
      .select()
      .from(commentsTable)
      .where(
        and(
          eq(commentsTable.postId, post.id),
          eq(commentsTable.status, "approved"),
        ),
      )
      .orderBy(desc(commentsTable.createdAt));

    res.json({
      ok: true,
      post: publicPostShape(post),
      comments: comments.map(publicCommentShape),
    });
  } catch (err) {
    req.log?.error?.({ err }, "Failed to load post");
    res.status(503).json({ ok: false, error: "Unable to load post." });
  }
});

/** Public: create pending comment (honeypot + rate limit) */
router.post("/posts/:slug/comments", async (req, res) => {
  const slug = req.params.slug ?? "";
  const honeypot =
    typeof req.body?.website === "string" ? req.body.website.trim() : "";

  // Honeypot: bots fill hidden "website" field — silently accept
  if (honeypot) {
    res.json({ ok: true });
    return;
  }

  const ip =
    (typeof req.headers["x-forwarded-for"] === "string"
      ? req.headers["x-forwarded-for"].split(",")[0]?.trim()
      : null) ||
    req.ip ||
    "unknown";

  if (isRateLimited(`comment:${ip}`, 5, 15 * 60 * 1000)) {
    res.status(429).json({
      ok: false,
      error: "Too many comments. Please try again later.",
    });
    return;
  }

  const authorName =
    typeof req.body?.authorName === "string" ? req.body.authorName.trim() : "";
  const authorEmail =
    typeof req.body?.authorEmail === "string"
      ? req.body.authorEmail.trim().toLowerCase()
      : "";
  const body = typeof req.body?.body === "string" ? req.body.body.trim() : "";

  if (!authorName || authorName.length > 80) {
    res.status(400).json({ ok: false, error: "A valid name is required." });
    return;
  }
  if (!authorEmail || !isValidEmail(authorEmail) || authorEmail.length > 160) {
    res.status(400).json({ ok: false, error: "A valid email is required." });
    return;
  }
  if (!body || body.length > 2000) {
    res.status(400).json({
      ok: false,
      error: "Comment must be between 1 and 2000 characters.",
    });
    return;
  }

  try {
    const [post] = await db
      .select({ id: postsTable.id })
      .from(postsTable)
      .where(
        and(eq(postsTable.slug, slug), eq(postsTable.status, "published")),
      )
      .limit(1);

    if (!post) {
      res.status(404).json({ ok: false, error: "Post not found." });
      return;
    }

    await db.insert(commentsTable).values({
      postId: post.id,
      authorName,
      authorEmail,
      body,
      status: "pending",
    });

    res.status(201).json({
      ok: true,
      message: "Thanks! Your comment will appear after approval.",
    });
  } catch (err) {
    req.log?.error?.({ err }, "Failed to create comment");
    res.status(503).json({ ok: false, error: "Unable to submit comment." });
  }
});

/** Admin: list all posts */
router.get("/admin/posts", requireAdmin, async (req: AuthedRequest, res) => {
  try {
    const posts = await db
      .select()
      .from(postsTable)
      .orderBy(desc(postsTable.updatedAt));

    res.json({ ok: true, posts: posts.map(publicPostShape) });
  } catch (err) {
    req.log?.error?.({ err }, "Failed to list admin posts");
    res.status(503).json({ ok: false, error: "Unable to load posts." });
  }
});

/** Admin: get one post by id */
router.get(
  "/admin/posts/:id",
  requireAdmin,
  async (req: AuthedRequest, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ ok: false, error: "Invalid post id." });
      return;
    }

    try {
      const [post] = await db
        .select()
        .from(postsTable)
        .where(eq(postsTable.id, id))
        .limit(1);

      if (!post) {
        res.status(404).json({ ok: false, error: "Post not found." });
        return;
      }

      res.json({ ok: true, post: publicPostShape(post) });
    } catch (err) {
      req.log?.error?.({ err }, "Failed to load admin post");
      res.status(503).json({ ok: false, error: "Unable to load post." });
    }
  },
);

/** Admin: create post */
router.post("/admin/posts", requireAdmin, async (req: AuthedRequest, res) => {
  const title = typeof req.body?.title === "string" ? req.body.title.trim() : "";
  const excerpt =
    typeof req.body?.excerpt === "string" ? req.body.excerpt.trim() : "";
  const body = typeof req.body?.body === "string" ? req.body.body : "";
  const statusRaw =
    typeof req.body?.status === "string" ? req.body.status : "draft";
  const status: PostStatus =
    statusRaw === "published" ? "published" : "draft";
  const metaTitle = parseMetaField(req.body?.metaTitle, META_TITLE_MAX);
  const metaDescription = parseMetaField(
    req.body?.metaDescription,
    META_DESCRIPTION_MAX,
  );
  const slug = normalizeSlug(
    title,
    typeof req.body?.slug === "string" ? req.body.slug : undefined,
  );

  if (!title) {
    res.status(400).json({ ok: false, error: "Title is required." });
    return;
  }

  try {
    const now = new Date();
    const [post] = await db
      .insert(postsTable)
      .values({
        title,
        slug,
        excerpt,
        body,
        status,
        metaTitle,
        metaDescription,
        publishedAt: status === "published" ? now : null,
        updatedAt: now,
      })
      .returning();

    res.status(201).json({ ok: true, post: publicPostShape(post) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("unique") || message.includes("duplicate")) {
      res.status(409).json({ ok: false, error: "That slug is already in use." });
      return;
    }
    req.log?.error?.({ err }, "Failed to create post");
    res.status(503).json({ ok: false, error: "Unable to create post." });
  }
});

/** Admin: update post */
router.patch(
  "/admin/posts/:id",
  requireAdmin,
  async (req: AuthedRequest, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ ok: false, error: "Invalid post id." });
      return;
    }

    try {
      const [existing] = await db
        .select()
        .from(postsTable)
        .where(eq(postsTable.id, id))
        .limit(1);

      if (!existing) {
        res.status(404).json({ ok: false, error: "Post not found." });
        return;
      }

      const title =
        typeof req.body?.title === "string"
          ? req.body.title.trim()
          : existing.title;
      const excerpt =
        typeof req.body?.excerpt === "string"
          ? req.body.excerpt.trim()
          : existing.excerpt;
      const body =
        typeof req.body?.body === "string" ? req.body.body : existing.body;
      const status: PostStatus =
        req.body?.status === "published"
          ? "published"
          : req.body?.status === "draft"
            ? "draft"
            : existing.status;
      const metaTitle =
        req.body && "metaTitle" in req.body
          ? parseMetaField(req.body.metaTitle, META_TITLE_MAX)
          : existing.metaTitle;
      const metaDescription =
        req.body && "metaDescription" in req.body
          ? parseMetaField(req.body.metaDescription, META_DESCRIPTION_MAX)
          : existing.metaDescription;
      const slug = normalizeSlug(
        title,
        typeof req.body?.slug === "string" ? req.body.slug : existing.slug,
      );

      if (!title) {
        res.status(400).json({ ok: false, error: "Title is required." });
        return;
      }

      const now = new Date();
      let publishedAt = existing.publishedAt;
      if (status === "published" && existing.status !== "published") {
        publishedAt = now;
      }
      if (status === "draft") {
        publishedAt = null;
      }

      const [post] = await db
        .update(postsTable)
        .set({
          title,
          slug,
          excerpt,
          body,
          status,
          metaTitle,
          metaDescription,
          publishedAt,
          updatedAt: now,
        })
        .where(eq(postsTable.id, id))
        .returning();

      res.json({ ok: true, post: publicPostShape(post) });
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (message.includes("unique") || message.includes("duplicate")) {
        res
          .status(409)
          .json({ ok: false, error: "That slug is already in use." });
        return;
      }
      req.log?.error?.({ err }, "Failed to update post");
      res.status(503).json({ ok: false, error: "Unable to update post." });
    }
  },
);

/** Admin: delete post */
router.delete(
  "/admin/posts/:id",
  requireAdmin,
  async (req: AuthedRequest, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ ok: false, error: "Invalid post id." });
      return;
    }

    try {
      const deleted = await db
        .delete(postsTable)
        .where(eq(postsTable.id, id))
        .returning({ id: postsTable.id });

      if (deleted.length === 0) {
        res.status(404).json({ ok: false, error: "Post not found." });
        return;
      }

      res.json({ ok: true });
    } catch (err) {
      req.log?.error?.({ err }, "Failed to delete post");
      res.status(503).json({ ok: false, error: "Unable to delete post." });
    }
  },
);

/** Admin: list comments (optional status filter) */
router.get(
  "/admin/comments",
  requireAdmin,
  async (req: AuthedRequest, res) => {
    const statusParam =
      typeof req.query.status === "string" ? req.query.status : undefined;
    const status: CommentStatus | undefined =
      statusParam === "pending" ||
      statusParam === "approved" ||
      statusParam === "rejected"
        ? statusParam
        : undefined;

    try {
      const rows = status
        ? await db
            .select({
              id: commentsTable.id,
              postId: commentsTable.postId,
              authorName: commentsTable.authorName,
              authorEmail: commentsTable.authorEmail,
              body: commentsTable.body,
              status: commentsTable.status,
              createdAt: commentsTable.createdAt,
              postTitle: postsTable.title,
              postSlug: postsTable.slug,
            })
            .from(commentsTable)
            .innerJoin(postsTable, eq(commentsTable.postId, postsTable.id))
            .where(eq(commentsTable.status, status))
            .orderBy(desc(commentsTable.createdAt))
        : await db
            .select({
              id: commentsTable.id,
              postId: commentsTable.postId,
              authorName: commentsTable.authorName,
              authorEmail: commentsTable.authorEmail,
              body: commentsTable.body,
              status: commentsTable.status,
              createdAt: commentsTable.createdAt,
              postTitle: postsTable.title,
              postSlug: postsTable.slug,
            })
            .from(commentsTable)
            .innerJoin(postsTable, eq(commentsTable.postId, postsTable.id))
            .orderBy(desc(commentsTable.createdAt));

      res.json({ ok: true, comments: rows });
    } catch (err) {
      req.log?.error?.({ err }, "Failed to list comments");
      res.status(503).json({ ok: false, error: "Unable to load comments." });
    }
  },
);

/** Admin: approve / reject comment */
router.patch(
  "/admin/comments/:id",
  requireAdmin,
  async (req: AuthedRequest, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ ok: false, error: "Invalid comment id." });
      return;
    }

    const statusRaw =
      typeof req.body?.status === "string" ? req.body.status : "";
    if (statusRaw !== "approved" && statusRaw !== "rejected") {
      res.status(400).json({
        ok: false,
        error: 'Status must be "approved" or "rejected".',
      });
      return;
    }

    try {
      const [comment] = await db
        .update(commentsTable)
        .set({ status: statusRaw })
        .where(eq(commentsTable.id, id))
        .returning();

      if (!comment) {
        res.status(404).json({ ok: false, error: "Comment not found." });
        return;
      }

      res.json({
        ok: true,
        comment: {
          id: comment.id,
          status: comment.status,
          authorName: comment.authorName,
          authorEmail: comment.authorEmail,
          body: comment.body,
          postId: comment.postId,
          createdAt: comment.createdAt,
        },
      });
    } catch (err) {
      req.log?.error?.({ err }, "Failed to update comment");
      res.status(503).json({ ok: false, error: "Unable to update comment." });
    }
  },
);

export default router;
