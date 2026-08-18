/**
 * Seeds default SEO metadata for fixed public routes. Existing rows are left
 * untouched (only inserts missing paths), so it is safe to run repeatedly and
 * will never overwrite the client's own edits.
 *
 * Usage:
 *   DATABASE_URL=... pnpm --filter @workspace/db run seed-seo
 */
import { closePool, db } from "./index";
import { pageMetaTable } from "./schema";
import { staticPageMetaDefaults } from "./seo-defaults";

async function seedPageMeta() {
  for (const entry of staticPageMetaDefaults) {
    await db
      .insert(pageMetaTable)
      .values({
        path: entry.path,
        title: entry.title,
        description: entry.description,
      })
      .onConflictDoNothing({ target: pageMetaTable.path });
  }

  console.log(`Seeded ${staticPageMetaDefaults.length} page-meta defaults.`);
  await closePool();
}

seedPageMeta().catch((err) => {
  console.error(err);
  process.exit(1);
});
