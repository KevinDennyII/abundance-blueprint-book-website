import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { adminsTable } from "./admins";

export const passkeysTable = pgTable("passkeys", {
  id: serial("id").primaryKey(),
  adminId: integer("admin_id")
    .notNull()
    .references(() => adminsTable.id, { onDelete: "cascade" }),
  /** base64url credential ID */
  credentialId: text("credential_id").notNull().unique(),
  /** base64url public key */
  publicKey: text("public_key").notNull(),
  counter: integer("counter").notNull().default(0),
  transports: text("transports"),
  deviceType: text("device_type"),
  backedUp: text("backed_up"),
  label: text("label").notNull().default("Passkey"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
});

export type InsertPasskey = typeof passkeysTable.$inferInsert;
export type Passkey = typeof passkeysTable.$inferSelect;
