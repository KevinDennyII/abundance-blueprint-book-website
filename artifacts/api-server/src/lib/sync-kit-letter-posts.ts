import { and, eq } from "drizzle-orm";
import { db, postsTable } from "@workspace/db";
import {
  fetchKitCreatorPost,
  listKitCreatorPosts,
} from "./kit-creator-posts";
import { kitExcerpt, kitHtmlToMarkdown } from "./html-to-markdown";
import { logger } from "./logger";

export const KIT_POST_SOURCE = "kit";

/** Default: refresh at most every 15 minutes unless forced. */
const DEFAULT_SYNC_TTL_MS = 15 * 60 * 1000;

let lastSyncAt = 0;
let lastSyncError: string | null = null;
let syncInFlight: Promise<SyncKitLetterResult> | null = null;

export type SyncKitLetterResult = {
  ok: boolean;
  synced: number;
  skipped: boolean;
  hasMore: boolean;
  slugs: string[];
  error?: string;
};

function syncTtlMs(): number {
  const raw = process.env.KIT_LETTER_SYNC_TTL_MS?.trim();
  if (raw && /^\d+$/.test(raw)) return Number(raw);
  return DEFAULT_SYNC_TTL_MS;
}

export function kitLetterSyncStatus() {
  return {
    lastSyncAt: lastSyncAt || null,
    lastSyncError,
    ttlMs: syncTtlMs(),
  };
}

/**
 * Pull published posts from the Kit creator site into `posts` (source=kit).
 * Public Letter page only lists Kit-sourced published posts after a successful sync.
 */
export async function syncKitLetterPosts(options?: {
  force?: boolean;
}): Promise<SyncKitLetterResult> {
  const force = options?.force === true;
  const now = Date.now();

  if (!force && lastSyncAt > 0 && now - lastSyncAt < syncTtlMs()) {
    return {
      ok: true,
      synced: 0,
      skipped: true,
      hasMore: false,
      slugs: [],
    };
  }

  if (syncInFlight) return syncInFlight;

  syncInFlight = (async () => {
    try {
      const { posts: summaries, hasMore } = await listKitCreatorPosts();
      if (summaries.length === 0) {
        lastSyncError = "Kit creator site returned no posts";
        logger.warn(lastSyncError);
        return {
          ok: false,
          synced: 0,
          skipped: false,
          hasMore,
          slugs: [],
          error: lastSyncError,
        };
      }

      const syncedSlugs: string[] = [];

      for (const summary of summaries) {
        const detail = await fetchKitCreatorPost(summary.url);
        const body = kitHtmlToMarkdown(detail.contentHtml, detail.title);
        if (!body.trim()) {
          logger.warn({ slug: summary.slug }, "Skipping Kit post with empty body");
          continue;
        }

        const excerpt = kitExcerpt(
          detail.metaDescription,
          detail.introContent,
          body,
        );
        const publishedAt = detail.publishedAt
          ? new Date(detail.publishedAt)
          : new Date();
        const nowTs = new Date();
        const sourceId = String(detail.id);

        const [existing] = await db
          .select()
          .from(postsTable)
          .where(eq(postsTable.slug, detail.slug))
          .limit(1);

        if (existing) {
          await db
            .update(postsTable)
            .set({
              title: detail.title,
              excerpt,
              body,
              status: "published",
              metaTitle: detail.title,
              metaDescription: detail.metaDescription || excerpt || null,
              publishedAt,
              source: KIT_POST_SOURCE,
              sourceId,
              updatedAt: nowTs,
            })
            .where(eq(postsTable.id, existing.id));
        } else {
          await db.insert(postsTable).values({
            slug: detail.slug,
            title: detail.title,
            excerpt,
            body,
            status: "published",
            metaTitle: detail.title,
            metaDescription: detail.metaDescription || excerpt || null,
            publishedAt,
            source: KIT_POST_SOURCE,
            sourceId,
            createdAt: publishedAt,
            updatedAt: nowTs,
          });
        }

        syncedSlugs.push(detail.slug);
      }

      // Unpublish formerly Kit-synced posts that disappeared from Kit.
      if (syncedSlugs.length > 0) {
        const kitRows = await db
          .select({ id: postsTable.id, slug: postsTable.slug })
          .from(postsTable)
          .where(eq(postsTable.source, KIT_POST_SOURCE));

        for (const row of kitRows) {
          if (!syncedSlugs.includes(row.slug)) {
            await db
              .update(postsTable)
              .set({
                status: "draft",
                updatedAt: new Date(),
              })
              .where(eq(postsTable.id, row.id));
          }
        }
      }

      lastSyncAt = Date.now();
      lastSyncError = null;

      if (hasMore) {
        logger.warn(
          "Kit profile reported hasMore=true; only the first page of posts was synced",
        );
      }

      logger.info(
        { count: syncedSlugs.length, slugs: syncedSlugs },
        "Synced Kit letter posts",
      );

      return {
        ok: true,
        synced: syncedSlugs.length,
        skipped: false,
        hasMore,
        slugs: syncedSlugs,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      lastSyncError = message;
      logger.error({ err }, "Kit letter sync failed");
      return {
        ok: false,
        synced: 0,
        skipped: false,
        hasMore: false,
        slugs: [],
        error: message,
      };
    } finally {
      syncInFlight = null;
    }
  })();

  return syncInFlight;
}

/** Fire-and-forget / awaitable gate used by public letter routes. */
export async function ensureKitLetterPostsFresh(): Promise<void> {
  await syncKitLetterPosts({ force: false });
}

/** Public Letter listing: Kit-sourced published posts only. */
export function kitPublishedOnlyFilter() {
  return and(
    eq(postsTable.status, "published"),
    eq(postsTable.source, KIT_POST_SOURCE),
  );
}
