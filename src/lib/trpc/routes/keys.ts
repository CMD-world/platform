import crypto from "crypto";
import { z } from "zod";
import { t } from "$lib/trpc/t";
import { privateProcedure } from "$lib/trpc/context";
import { db } from "$lib/database";
import { apiKeyTable } from "$lib/schema";
import { createSelectSchema } from "drizzle-zod";

export const keys = t.router({
  create: privateProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/keys.create",
        tags: ["API Keys"],
        description: "Create new API Key for user.",
      },
    })
    .input(z.void())
    .output(createSelectSchema(apiKeyTable))
    .mutation(async ({ ctx: { user } }) => {
      const [apiKey] = await db
        .insert(apiKeyTable)
        .values({
          userId: user.id,
          apiKey: `cmd_${crypto.randomBytes(32).toString("base64url")}`,
        })
        .returning();
      return apiKey;
    }),
});
