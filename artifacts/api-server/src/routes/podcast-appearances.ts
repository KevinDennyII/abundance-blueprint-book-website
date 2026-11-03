import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import {
  db,
  podcastAppearancesTable,
  type PodcastAppearanceRow,
  type PodcastAppearanceStatus,
} from "@workspace/db";
import { requireAdmin, type AuthedRequest } from "../lib/require-admin";
import { isIsoDate } from "../lib/live-event-utils";

const router: IRouter = Router();

type AppearanceFields = {
  showName: string;
  episodeTitle: string;
  publishedDate: string;
  episodeLink: string;
  embedCode: string;
  description: string;
  status: PodcastAppearanceStatus;
};

function publicShape(row: PodcastAppearanceRow) {
  return {
    id: row.id,
    showName: row.showName,
    episodeTitle: row.episodeTitle,
    publishedDate: row.publishedDate,
    episodeLink: row.episodeLink,
    embedCode: row.embedCode,
    description: row.description,
  };
}

function adminShape(row: PodcastAppearanceRow) {
  return {
    id: row.id,
    showName: row.showName,
    episodeTitle: row.episodeTitle,
    publishedDate: row.publishedDate,
    episodeLink: row.episodeLink,
    embedCode: row.embedCode,
    description: row.description,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function parseStatus(value: unknown): PodcastAppearanceStatus {
  return value === "published" ? "published" : "draft";
}

function parseAppearanceFields(
  body: Record<string, unknown>,
): AppearanceFields | { error: string } {
  const showName =
    typeof body.showName === "string" ? body.showName.trim() : "";
  if (!showName) {
    return { error: "Show name is required." };
  }

  const episodeTitle =
    typeof body.episodeTitle === "string" ? body.episodeTitle.trim() : "";
  if (!episodeTitle) {
    return { error: "Episode title is required." };
  }

  const publishedDate =
    typeof body.publishedDate === "string" ? body.publishedDate.trim() : "";
  if (!isIsoDate(publishedDate)) {
    return { error: "Date published must be a valid YYYY-MM-DD value." };
  }

  const episodeLink =
    typeof body.episodeLink === "string" ? body.episodeLink.trim() : "";
  const embedCode =
    typeof body.embedCode === "string" ? body.embedCode.trim() : "";
  const description =
    typeof body.description === "string" ? body.description.trim() : "";
  const status = parseStatus(body.status);

  if (status === "published" && !episodeLink && !embedCode) {
    return {
      error:
        "Published appearances need an episode link or embed code so listeners can play them.",
    };
  }

  return {
    showName,
    episodeTitle,
    publishedDate,
    episodeLink,
    embedCode,
    description,
    status,
  };
}

async function listPublicPublished() {
  const rows = await db
    .select()
    .from(podcastAppearancesTable)
    .where(eq(podcastAppearancesTable.status, "published"))
    .orderBy(
      desc(podcastAppearancesTable.publishedDate),
      desc(podcastAppearancesTable.id),
    );

  return rows.map(publicShape);
}

/** Public: published appearances, newest first. */
router.get("/podcast-appearances", async (req, res) => {
  try {
    const appearances = await listPublicPublished();
    res.setHeader("Cache-Control", "public, max-age=60");
    res.json({ ok: true, appearances });
  } catch (firstErr) {
    try {
      const { ensureSchema } = await import("@workspace/db");
      await ensureSchema();
      const appearances = await listPublicPublished();
      res.setHeader("Cache-Control", "public, max-age=60");
      res.json({ ok: true, appearances });
    } catch (err) {
      req.log?.error?.(
        { err, firstErr },
        "Failed to list podcast appearances",
      );
      res.status(503).json({
        ok: false,
        error: "Could not load podcast appearances right now.",
        appearances: [],
      });
    }
  }
});

/** Admin: list all appearances (optional filter=all|published|draft). */
router.get(
  "/admin/podcast-appearances",
  requireAdmin,
  async (req: AuthedRequest, res) => {
    const filter =
      typeof req.query.filter === "string" ? req.query.filter : "all";

    try {
      let rows: PodcastAppearanceRow[];
      if (filter === "published" || filter === "draft") {
        rows = await db
          .select()
          .from(podcastAppearancesTable)
          .where(eq(podcastAppearancesTable.status, filter))
          .orderBy(
            desc(podcastAppearancesTable.publishedDate),
            desc(podcastAppearancesTable.id),
          );
      } else {
        rows = await db
          .select()
          .from(podcastAppearancesTable)
          .orderBy(
            desc(podcastAppearancesTable.publishedDate),
            desc(podcastAppearancesTable.id),
          );
      }

      res.json({ ok: true, appearances: rows.map(adminShape) });
    } catch (err) {
      req.log?.error?.({ err }, "Failed to list admin podcast appearances");
      res
        .status(503)
        .json({ ok: false, error: "Unable to load podcast appearances." });
    }
  },
);

/** Admin: get one appearance. */
router.get(
  "/admin/podcast-appearances/:id",
  requireAdmin,
  async (req: AuthedRequest, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({ ok: false, error: "Invalid appearance id." });
      return;
    }

    try {
      const [row] = await db
        .select()
        .from(podcastAppearancesTable)
        .where(eq(podcastAppearancesTable.id, id))
        .limit(1);

      if (!row) {
        res.status(404).json({ ok: false, error: "Appearance not found." });
        return;
      }

      res.json({ ok: true, appearance: adminShape(row) });
    } catch (err) {
      req.log?.error?.({ err }, "Failed to load podcast appearance");
      res.status(503).json({ ok: false, error: "Unable to load appearance." });
    }
  },
);

/** Admin: create. */
router.post(
  "/admin/podcast-appearances",
  requireAdmin,
  async (req: AuthedRequest, res) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const fields = parseAppearanceFields(body);
    if ("error" in fields) {
      res.status(400).json({ ok: false, error: fields.error });
      return;
    }

    try {
      const [row] = await db
        .insert(podcastAppearancesTable)
        .values({
          ...fields,
          updatedAt: new Date(),
        })
        .returning();

      res.status(201).json({ ok: true, appearance: adminShape(row) });
    } catch (err) {
      req.log?.error?.({ err }, "Failed to create podcast appearance");
      res.status(503).json({ ok: false, error: "Unable to create appearance." });
    }
  },
);

/** Admin: update. */
router.patch(
  "/admin/podcast-appearances/:id",
  requireAdmin,
  async (req: AuthedRequest, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({ ok: false, error: "Invalid appearance id." });
      return;
    }

    const body = (req.body ?? {}) as Record<string, unknown>;
    const fields = parseAppearanceFields(body);
    if ("error" in fields) {
      res.status(400).json({ ok: false, error: fields.error });
      return;
    }

    try {
      const [row] = await db
        .update(podcastAppearancesTable)
        .set({
          ...fields,
          updatedAt: new Date(),
        })
        .where(eq(podcastAppearancesTable.id, id))
        .returning();

      if (!row) {
        res.status(404).json({ ok: false, error: "Appearance not found." });
        return;
      }

      res.json({ ok: true, appearance: adminShape(row) });
    } catch (err) {
      req.log?.error?.({ err }, "Failed to update podcast appearance");
      res.status(503).json({ ok: false, error: "Unable to update appearance." });
    }
  },
);

/** Admin: delete. */
router.delete(
  "/admin/podcast-appearances/:id",
  requireAdmin,
  async (req: AuthedRequest, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({ ok: false, error: "Invalid appearance id." });
      return;
    }

    try {
      const deleted = await db
        .delete(podcastAppearancesTable)
        .where(eq(podcastAppearancesTable.id, id))
        .returning({ id: podcastAppearancesTable.id });

      if (deleted.length === 0) {
        res.status(404).json({ ok: false, error: "Appearance not found." });
        return;
      }

      res.json({ ok: true, deleted: 1 });
    } catch (err) {
      req.log?.error?.({ err }, "Failed to delete podcast appearance");
      res.status(503).json({ ok: false, error: "Unable to delete appearance." });
    }
  },
);

export default router;
