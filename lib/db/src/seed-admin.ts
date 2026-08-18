/**
 * Upserts the admin account from ADMIN_EMAIL / ADMIN_PASSWORD.
 *
 * Usage:
 *   DATABASE_URL=... ADMIN_EMAIL=... ADMIN_PASSWORD=... pnpm --filter @workspace/db run seed
 */
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { closePool, db } from "./index";
import { adminsTable } from "./schema";

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD must be set to seed the admin account.",
    );
  }

  if (password.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const existing = await db.query.adminsTable.findFirst({
    where: eq(adminsTable.email, email),
  });

  if (existing) {
    await db
      .update(adminsTable)
      .set({ passwordHash })
      .where(eq(adminsTable.id, existing.id));
    console.log(`Updated password for admin: ${email}`);
  } else {
    await db.insert(adminsTable).values({ email, passwordHash });
    console.log(`Created admin: ${email}`);
  }

  await closePool();
}

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
