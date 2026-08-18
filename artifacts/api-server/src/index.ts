import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import app from "./app";
import { logger } from "./lib/logger";

function loadLocalEnv(): void {
  const envPath = resolve(
    dirname(fileURLToPath(import.meta.url)),
    "../.env",
  );

  if (!existsSync(envPath)) {
    return;
  }

  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const eq = trimmed.indexOf("=");
    if (eq === -1) {
      continue;
    }

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadLocalEnv();

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function bootstrapDatabase(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    logger.warn("DATABASE_URL is not set; blog/admin tables will not be available");
    return;
  }

  try {
    const { ensurePageMetaDefaults, ensureSchema } = await import("@workspace/db");
    await ensureSchema();
    await ensurePageMetaDefaults();
    logger.info("Database schema is ready");
  } catch (err) {
    logger.error({ err }, "Failed to ensure database schema");
    return;
  }

  await bootstrapAdminIfNeeded();
}

async function bootstrapAdminIfNeeded(): Promise<void> {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    logger.warn("ADMIN_EMAIL or ADMIN_PASSWORD is missing; skipping admin bootstrap");
    return;
  }

  if (password.length < 8) {
    logger.warn("ADMIN_PASSWORD is shorter than 8 characters; skipping bootstrap");
    return;
  }

  try {
    const { count } = await import("drizzle-orm");
    const bcrypt = await import("bcryptjs");
    const { adminsTable, db } = await import("@workspace/db");

    const [row] = await db.select({ value: count() }).from(adminsTable);
    if ((row?.value ?? 0) > 0) {
      logger.info("Admin account already exists; leaving password unchanged");
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await db.insert(adminsTable).values({ email, passwordHash });
    logger.info({ email }, "Created initial admin from ADMIN_EMAIL / ADMIN_PASSWORD");
  } catch (err) {
    logger.error({ err }, "Failed to bootstrap admin account");
  }
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
  void bootstrapDatabase();
});
