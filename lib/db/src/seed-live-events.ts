/**
 * Seeds the initial Long Money Live event migrated from the Google Sheet.
 * Safe to re-run: skips insert when any live_events row already exists.
 *
 * Usage:
 *   DATABASE_URL=... pnpm --filter @workspace/db run seed-live-events
 */
import { closePool, db } from "./index";
import { liveEventsTable } from "./schema";

async function main() {
  const existing = await db.select({ id: liveEventsTable.id }).from(liveEventsTable).limit(1);
  if (existing.length > 0) {
    console.log("live_events already has rows — skipping seed.");
    return;
  }

  await db.insert(liveEventsTable).values({
    showOnSite: true,
    eventDate: "2026-12-16",
    time: "6:00 PM",
    type: "Workshop",
    title: "There's Life Beneath the Numbers",
    venue: "Long Money Concepts, LLC",
    address: "4414 Bayonne Ave",
    cityState: "Baltimore, MD",
    price: "Free",
    rsvpLink: "https://longmoneycpa.as.me/1216",
  });

  console.log("Seeded 1 live event (2026-12-16 birthday workshop).");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closePool();
  });
