import crypto from "crypto";
import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";
import { db } from "$lib/database";
import { apiKeyTable } from "$lib/schema";
import { privateProcedure } from "$lib/trpc/context";

export const keys = privateProcedure
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
  });
