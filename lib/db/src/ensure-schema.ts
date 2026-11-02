import pg from "pg";
import { db } from "./index";
import { liveEventsTable } from "./schema/live-events";
import { pageMetaTable } from "./schema/page-meta";
import { staticPageMetaDefaults } from "./seo-defaults";

const statements = [
  `CREATE TABLE IF NOT EXISTS admins (
    id serial PRIMARY KEY,
    email text NOT NULL UNIQUE,
    password_hash text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS posts (
    id serial PRIMARY KEY,
    slug text NOT NULL UNIQUE,
    title text NOT NULL,
    excerpt text NOT NULL DEFAULT '',
    body text NOT NULL DEFAULT '',
    status text NOT NULL DEFAULT 'draft',
    meta_title text,
    meta_description text,
    published_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )`,
  `ALTER TABLE posts ADD COLUMN IF NOT EXISTS meta_title text`,
  `ALTER TABLE posts ADD COLUMN IF NOT EXISTS meta_description text`,
  `CREATE TABLE IF NOT EXISTS comments (
    id serial PRIMARY KEY,
    post_id integer NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_name text NOT NULL,
    author_email text NOT NULL,
    body text NOT NULL,
    status text NOT NULL DEFAULT 'pending',
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS passkeys (
    id serial PRIMARY KEY,
    admin_id integer NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
    credential_id text NOT NULL UNIQUE,
    public_key text NOT NULL,
    counter integer NOT NULL DEFAULT 0,
    transports text,
    device_type text,
    backed_up text,
    label text NOT NULL DEFAULT 'Passkey',
    created_at timestamptz NOT NULL DEFAULT now(),
    last_used_at timestamptz
  )`,
  `CREATE TABLE IF NOT EXISTS page_meta (
    id serial PRIMARY KEY,
    path text NOT NULL UNIQUE,
    title text NOT NULL DEFAULT '',
    description text NOT NULL DEFAULT '',
    updated_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS live_events (
    id serial PRIMARY KEY,
    show_on_site boolean NOT NULL DEFAULT false,
    event_date text NOT NULL,
    time text NOT NULL DEFAULT '',
    type text NOT NULL DEFAULT '',
    title text NOT NULL,
    venue text NOT NULL DEFAULT '',
    address text NOT NULL DEFAULT '',
    city_state text NOT NULL DEFAULT '',
    price text NOT NULL DEFAULT '',
    rsvp_link text NOT NULL DEFAULT '',
    series_id text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS live_events_event_date_idx ON live_events (event_date)`,
  `CREATE INDEX IF NOT EXISTS live_events_series_id_idx ON live_events (series_id)`,
];

/** Idempotent: creates blog/admin tables on first boot (Replit Database, local Docker). */
export async function ensureSchema(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set");
  }

  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    for (const statement of statements) {
      await client.query(statement);
    }
  } finally {
    await client.end();
  }
}

export async function ensurePageMetaDefaults(): Promise<void> {
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
}

/**
 * One-time migration seed from the former Google Sheet (birthday workshop).
 * Skips when any live_events row already exists.
 */
export async function ensureLiveEventDefaults(): Promise<void> {
  const existing = await db
    .select({ id: liveEventsTable.id })
    .from(liveEventsTable)
    .limit(1);
  if (existing.length > 0) return;

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
}
