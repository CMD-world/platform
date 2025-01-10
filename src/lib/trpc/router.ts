import crypto from "crypto";
import { z } from "zod";
import { initTRPC } from "@trpc/server";
import { type Context } from "$lib/trpc/context";
import { type OpenApiMeta } from "trpc-to-openapi";
import { db } from "$lib/database";
import { apiKeyTable } from "$lib/schema";
import { createSelectSchema } from "drizzle-zod";

export const t = initTRPC.context<Context>().meta<OpenApiMeta>().create();

export const router = t.router({
  keys: t.procedure
    .meta({ openapi: { method: "POST", path: "/api-keys", tags: ["API Keys"] } })
    .input(z.void())
    .output(createSelectSchema(apiKeyTable))
    .mutation(async ({ ctx: { user } }) => {
      const [apiKey] = await db
        .insert(apiKeyTable)
        .values({
          userId: user!.id,
          apiKey: `cmd_${crypto.randomBytes(32).toString("base64url")}`,
        })
        .returning();
      return apiKey;
    }),
});

export type Router = typeof router;
