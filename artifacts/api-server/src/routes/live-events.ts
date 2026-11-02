import { Router, type IRouter } from "express";
import { and, asc, desc, eq, gte, lt } from "drizzle-orm";
import { db, liveEventsTable, type LiveEventRow } from "@workspace/db";
import { requireAdmin, type AuthedRequest } from "../lib/require-admin";
import {
  expandOccurrenceDates,
  isIsoDate,
  isRepeatInterval,
  newSeriesId,
  startOfToday,
  toIsoDate,
  type RepeatInterval,
} from "../lib/live-event-utils";

const router: IRouter = Router();

type EventFields = {
  showOnSite: boolean;
  eventDate: string;
  time: string;
  type: string;
  title: string;
  venue: string;
  address: string;
  cityState: string;
  price: string;
  rsvpLink: string;
};

function publicShape(row: LiveEventRow) {
  return {
    id: row.id,
    date: row.eventDate,
    time: row.time,
    type: row.type,
    title: row.title,
    venue: row.venue,
    address: row.address,
    cityState: row.cityState,
    price: row.price,
    rsvpLink: row.rsvpLink,
  };
}

function adminShape(row: LiveEventRow) {
  return {
    id: row.id,
    showOnSite: row.showOnSite,
    eventDate: row.eventDate,
    time: row.time,
    type: row.type,
    title: row.title,
    venue: row.venue,
    address: row.address,
    cityState: row.cityState,
    price: row.price,
    rsvpLink: row.rsvpLink,
    seriesId: row.seriesId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function parseBool(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    if (v === "true" || v === "1" || v === "yes") return true;
    if (v === "false" || v === "0" || v === "no") return false;
  }
  return fallback;
}

function parseEventFields(
  body: Record<string, unknown>,
): EventFields | { error: string } {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) {
    return { error: "Title is required." };
  }

  const eventDate =
    typeof body.eventDate === "string"
      ? body.eventDate.trim()
      : typeof body.date === "string"
        ? body.date.trim()
        : "";
  if (!isIsoDate(eventDate)) {
    return { error: "Date must be a valid YYYY-MM-DD value." };
  }

  return {
    showOnSite: parseBool(body.showOnSite, false),
    eventDate,
    time: typeof body.time === "string" ? body.time.trim() : "",
    type: typeof body.type === "string" ? body.type.trim() : "",
    title,
    venue: typeof body.venue === "string" ? body.venue.trim() : "",
    address: typeof body.address === "string" ? body.address.trim() : "",
    cityState:
      typeof body.cityState === "string" ? body.cityState.trim() : "",
    price: typeof body.price === "string" ? body.price.trim() : "",
    rsvpLink: typeof body.rsvpLink === "string" ? body.rsvpLink.trim() : "",
  };
}

async function listPublicUpcoming() {
  const today = toIsoDate(startOfToday());
  const rows = await db
    .select()
    .from(liveEventsTable)
    .where(
      and(
        eq(liveEventsTable.showOnSite, true),
        gte(liveEventsTable.eventDate, today),
      ),
    )
    .orderBy(asc(liveEventsTable.eventDate), asc(liveEventsTable.id));

  return rows.map(publicShape);
}

/** Public: upcoming published events (past dates auto-drop). */
router.get("/live/events", async (req, res) => {
  try {
    const events = await listPublicUpcoming();
    res.setHeader("Cache-Control", "public, max-age=60");
    res.json({ ok: true, events });
  } catch (firstErr) {
    try {
      const { ensureSchema } = await import("@workspace/db");
      await ensureSchema();
      const events = await listPublicUpcoming();
      res.setHeader("Cache-Control", "public, max-age=60");
      res.json({ ok: true, events });
    } catch (err) {
      req.log?.error?.({ err, firstErr }, "Failed to list live events");
      res.status(503).json({
        ok: false,
        error: "Could not load events right now.",
        events: [],
      });
    }
  }
});

/** Admin: list all events (optional filter=upcoming|past|all). */
router.get(
  "/admin/live-events",
  requireAdmin,
  async (req: AuthedRequest, res) => {
    const filter =
      typeof req.query.filter === "string" ? req.query.filter : "all";
    const today = toIsoDate(startOfToday());

    try {
      let rows: LiveEventRow[];
      if (filter === "upcoming") {
        rows = await db
          .select()
          .from(liveEventsTable)
          .where(gte(liveEventsTable.eventDate, today))
          .orderBy(asc(liveEventsTable.eventDate), asc(liveEventsTable.id));
      } else if (filter === "past") {
        rows = await db
          .select()
          .from(liveEventsTable)
          .where(lt(liveEventsTable.eventDate, today))
          .orderBy(desc(liveEventsTable.eventDate), desc(liveEventsTable.id));
      } else {
        rows = await db
          .select()
          .from(liveEventsTable)
          .orderBy(asc(liveEventsTable.eventDate), asc(liveEventsTable.id));
      }

      res.json({ ok: true, events: rows.map(adminShape) });
    } catch (err) {
      req.log?.error?.({ err }, "Failed to list admin live events");
      res.status(503).json({ ok: false, error: "Unable to load events." });
    }
  },
);

/** Admin: get one event. */
router.get(
  "/admin/live-events/:id",
  requireAdmin,
  async (req: AuthedRequest, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({ ok: false, error: "Invalid event id." });
      return;
    }

    try {
      const [row] = await db
        .select()
        .from(liveEventsTable)
        .where(eq(liveEventsTable.id, id))
        .limit(1);

      if (!row) {
        res.status(404).json({ ok: false, error: "Event not found." });
        return;
      }

      res.json({ ok: true, event: adminShape(row) });
    } catch (err) {
      req.log?.error?.({ err }, "Failed to load live event");
      res.status(503).json({ ok: false, error: "Unable to load event." });
    }
  },
);

/** Admin: create one event, or expand a repeating series. */
router.post(
  "/admin/live-events",
  requireAdmin,
  async (req: AuthedRequest, res) => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const fields = parseEventFields(body);
    if ("error" in fields) {
      res.status(400).json({ ok: false, error: fields.error });
      return;
    }

    const repeatRaw = body.repeatInterval;
    const wantsRepeat =
      repeatRaw !== undefined &&
      repeatRaw !== null &&
      repeatRaw !== "" &&
      repeatRaw !== "none";

    try {
      if (!wantsRepeat) {
        const [row] = await db
          .insert(liveEventsTable)
          .values({
            ...fields,
            seriesId: null,
            updatedAt: new Date(),
          })
          .returning();

        res.status(201).json({ ok: true, event: adminShape(row), created: 1 });
        return;
      }

      if (!isRepeatInterval(repeatRaw)) {
        res.status(400).json({
          ok: false,
          error: "Repeat interval must be weekly, biweekly, or monthly.",
        });
        return;
      }

      const endDate =
        typeof body.repeatEndDate === "string"
          ? body.repeatEndDate.trim()
          : "";
      if (!isIsoDate(endDate)) {
        res.status(400).json({
          ok: false,
          error: "Repeat end date must be a valid YYYY-MM-DD value.",
        });
        return;
      }

      const expanded = expandOccurrenceDates(
        fields.eventDate,
        endDate,
        repeatRaw as RepeatInterval,
      );
      if ("error" in expanded) {
        res.status(400).json({ ok: false, error: expanded.error });
        return;
      }

      const seriesId = newSeriesId();
      const now = new Date();
      const rows = await db
        .insert(liveEventsTable)
        .values(
          expanded.map((eventDate) => ({
            ...fields,
            eventDate,
            seriesId,
            updatedAt: now,
          })),
        )
        .returning();

      res.status(201).json({
        ok: true,
        event: adminShape(rows[0]),
        events: rows.map(adminShape),
        created: rows.length,
        seriesId,
      });
    } catch (err) {
      req.log?.error?.({ err }, "Failed to create live event");
      res.status(503).json({ ok: false, error: "Unable to create event." });
    }
  },
);

/** Admin: update a single occurrence. */
router.patch(
  "/admin/live-events/:id",
  requireAdmin,
  async (req: AuthedRequest, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({ ok: false, error: "Invalid event id." });
      return;
    }

    const body = (req.body ?? {}) as Record<string, unknown>;
    const fields = parseEventFields(body);
    if ("error" in fields) {
      res.status(400).json({ ok: false, error: fields.error });
      return;
    }

    try {
      const [row] = await db
        .update(liveEventsTable)
        .set({
          ...fields,
          updatedAt: new Date(),
        })
        .where(eq(liveEventsTable.id, id))
        .returning();

      if (!row) {
        res.status(404).json({ ok: false, error: "Event not found." });
        return;
      }

      res.json({ ok: true, event: adminShape(row) });
    } catch (err) {
      req.log?.error?.({ err }, "Failed to update live event");
      res.status(503).json({ ok: false, error: "Unable to update event." });
    }
  },
);

/** Admin: delete one occurrence, or entire series with ?series=1. */
router.delete(
  "/admin/live-events/:id",
  requireAdmin,
  async (req: AuthedRequest, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({ ok: false, error: "Invalid event id." });
      return;
    }

    const deleteSeries =
      req.query.series === "1" ||
      req.query.series === "true" ||
      parseBool(req.body?.deleteSeries, false);

    try {
      const [existing] = await db
        .select()
        .from(liveEventsTable)
        .where(eq(liveEventsTable.id, id))
        .limit(1);

      if (!existing) {
        res.status(404).json({ ok: false, error: "Event not found." });
        return;
      }

      if (deleteSeries && existing.seriesId) {
        const deleted = await db
          .delete(liveEventsTable)
          .where(eq(liveEventsTable.seriesId, existing.seriesId))
          .returning({ id: liveEventsTable.id });

        res.json({
          ok: true,
          deleted: deleted.length,
          seriesId: existing.seriesId,
        });
        return;
      }

      await db.delete(liveEventsTable).where(eq(liveEventsTable.id, id));
      res.json({ ok: true, deleted: 1 });
    } catch (err) {
      req.log?.error?.({ err }, "Failed to delete live event");
      res.status(503).json({ ok: false, error: "Unable to delete event." });
    }
  },
);

export default router;
