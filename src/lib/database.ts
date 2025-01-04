import * as schema from "$lib/schema";
import { env } from "$env/dynamic/private";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

// Create database
const config = {
  url: env.TURSO_DATABASE_URL ?? "file:database.db",
  authToken: env.TURSO_AUTH_TOKEN,
};
const client = createClient(config);
export const db = drizzle(client, { schema });

// Optimize database
if (config.url.startsWith("file:")) {
  await db.run(`
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = NORMAL;
    PRAGMA busy_timeout = 5000;
    PRAGMA cache_size = 1000000000;
    PRAGMA foreign_keys = true;
    PRAGMA temp_store = memory;
  `);
}

// Run migrations automatically, remove if using Cloudflare Pages
const { migrate } = await import("drizzle-orm/libsql/migrator");
await migrate(db, { migrationsFolder: "migrations" });
