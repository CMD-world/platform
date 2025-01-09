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

// Types
export type User = InferSelectModel<typeof userTable>;
