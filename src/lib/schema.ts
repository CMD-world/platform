import { sql, type InferSelectModel } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Tables
export const userTable = sqliteTable("user", {
  id: integer().primaryKey(),
  privyId: text().notNull(),
  createdAt: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer()
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`),
});

export const apiKeyTable = sqliteTable("apiKey", {
  id: integer().primaryKey(),
  userId: integer()
    .notNull()
    .references(() => userTable.id),
  apiKey: text().notNull().unique(),
  expiresAt: integer({ mode: "timestamp" }),
  createdAt: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const commandTable = sqliteTable("command", {
  id: integer().primaryKey(),
  userId: integer()
    .notNull()
    .references(() => userTable.id),
  name: text().notNull(),
  slug: text().notNull(),
  createdAt: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Types
export type User = InferSelectModel<typeof userTable>;
export type ApiKey = InferSelectModel<typeof apiKeyTable>;
export type Command = InferSelectModel<typeof commandTable>;
