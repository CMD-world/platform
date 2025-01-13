import type { Parameter } from "$forms/workflowSchema";
import { sql, type InferSelectModel } from "drizzle-orm";
import { sqliteTable, text, integer, unique } from "drizzle-orm/sqlite-core";

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
    .references(() => userTable.id, { onDelete: "cascade" }),
  apiKey: text().notNull().unique(),
  expiresAt: integer({ mode: "timestamp" }),
  createdAt: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const commandTable = sqliteTable(
  "command",
  {
    id: integer().primaryKey(),
    userId: integer()
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    name: text().notNull(),
    slug: text().notNull(),
    createdAt: integer({ mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => ({
    uniqueUserCommand: unique().on(table.userId, table.slug),
  }),
);

export const workflowTable = sqliteTable(
  "workflow",
  {
    id: integer().primaryKey(),
    commandId: integer()
      .notNull()
      .references(() => commandTable.id, { onDelete: "cascade" }),
    url: text().notNull(),
    inputs: text({ mode: "json" }).$type<Parameter[]>().notNull(),
    outputs: text({ mode: "json" }).$type<Parameter[]>().notNull(),
    name: text().notNull(),
    slug: text().notNull(),
    createdAt: integer({ mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => ({
    uniqueCommandWorkflow: unique().on(table.commandId, table.slug),
  }),
);

// Types
export type User = InferSelectModel<typeof userTable>;
export type ApiKey = InferSelectModel<typeof apiKeyTable>;
export type Command = InferSelectModel<typeof commandTable>;
export type Workflow = InferSelectModel<typeof workflowTable>;
