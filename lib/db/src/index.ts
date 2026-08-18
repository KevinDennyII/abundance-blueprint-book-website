import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

type Db = ReturnType<typeof drizzle<typeof schema>>;

let _pool: pg.Pool | undefined;
let _db: Db | undefined;

function getPool(): pg.Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?",
    );
  }
  if (!_pool) {
    _pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return _pool;
}

function getDb(): Db {
  if (!_db) {
    _db = drizzle(getPool(), { schema });
  }
  return _db;
}

/** Lazy proxy so importing `@workspace/db` does not require DATABASE_URL until first query. */
export const db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    const instance = getDb();
    const value = Reflect.get(instance, prop, receiver);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

export async function closePool(): Promise<void> {
  if (_pool) {
    await _pool.end();
    _pool = undefined;
    _db = undefined;
  }
}

/** @deprecated Prefer `closePool()` — kept for seed script compatibility. */
export const pool = {
  end: closePool,
};

export * from "./schema";
export * from "./seo-defaults";
