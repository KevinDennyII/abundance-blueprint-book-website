import { Router, type IRouter } from "express";
import {
  db,
  pageMetaTable,
  staticPageMetaDefaults,
  staticPageMetaPaths,
  getPageMetaDefault,
} from "@workspace/db";
import { requireAdmin, type AuthedRequest } from "../lib/require-admin";

const router: IRouter = Router();

const TITLE_MAX = 120;
const DESCRIPTION_MAX = 320;

type ResolvedMeta = {
  path: string;
  title: string;
  description: string;
  isDefault: boolean;
};

/** Merge stored rows over the canonical defaults for every known static path. */
async function resolveAllPageMeta(): Promise<ResolvedMeta[]> {
  const rows = await db.select().from(pageMetaTable);
  const byPath = new Map(rows.map((row) => [row.path, row]));

  return staticPageMetaPaths.map((path) => {
    const fallback = getPageMetaDefault(path);
    const stored = byPath.get(path);
    return {
      path,
      title: stored?.title || fallback?.title || "",
      description: stored?.description || fallback?.description || "",
      isDefault: !stored,
    };
  });
}

/** Public: resolved SEO map for fixed public routes. */
router.get("/seo", async (req, res) => {
  try {
    const resolved = await resolveAllPageMeta();
    const pages: Record<string, { title: string; description: string }> = {};
    for (const entry of resolved) {
      pages[entry.path] = {
        title: entry.title,
        description: entry.description,
      };
    }
    res.json({ ok: true, pages });
  } catch (err) {
    req.log?.error?.({ err }, "Failed to load SEO metadata");
    // Fall back to static defaults so the site still renders sane meta.
    const pages: Record<string, { title: string; description: string }> = {};
    for (const entry of staticPageMetaDefaults) {
      pages[entry.path] = {
        title: entry.title,
        description: entry.description,
      };
    }
    res.json({ ok: true, pages });
  }
});

/** Admin: list editable page SEO (stored value or default) for each route. */
router.get("/admin/seo", requireAdmin, async (req: AuthedRequest, res) => {
  try {
    const pages = await resolveAllPageMeta();
    res.json({ ok: true, pages });
  } catch (err) {
    req.log?.error?.({ err }, "Failed to load admin SEO metadata");
    res.status(503).json({ ok: false, error: "Unable to load page SEO." });
  }
});

/** Admin: bulk upsert page SEO for known static routes. */
router.put("/admin/seo", requireAdmin, async (req: AuthedRequest, res) => {
  const incoming = Array.isArray(req.body?.pages) ? req.body.pages : null;
  if (!incoming) {
    res.status(400).json({ ok: false, error: "Expected a pages array." });
    return;
  }

  const known = new Set(staticPageMetaPaths);
  const updates: { path: string; title: string; description: string }[] = [];

  for (const entry of incoming) {
    const path = typeof entry?.path === "string" ? entry.path : "";
    if (!known.has(path)) {
      res
        .status(400)
        .json({ ok: false, error: `Unknown page path: ${path || "(empty)"}.` });
      return;
    }
    const title =
      typeof entry?.title === "string" ? entry.title.trim().slice(0, TITLE_MAX) : "";
    const description =
      typeof entry?.description === "string"
        ? entry.description.trim().slice(0, DESCRIPTION_MAX)
        : "";
    updates.push({ path, title, description });
  }

  try {
    const now = new Date();
    for (const update of updates) {
      await db
        .insert(pageMetaTable)
        .values({
          path: update.path,
          title: update.title,
          description: update.description,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: pageMetaTable.path,
          set: {
            title: update.title,
            description: update.description,
            updatedAt: now,
          },
        });
    }

    const pages = await resolveAllPageMeta();
    res.json({ ok: true, pages });
  } catch (err) {
    req.log?.error?.({ err }, "Failed to save admin SEO metadata");
    res.status(503).json({ ok: false, error: "Unable to save page SEO." });
  }
});

export default router;
