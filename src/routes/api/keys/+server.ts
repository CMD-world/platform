import crypto from "crypto";
import { error, json } from "@sveltejs/kit";
import { db } from "$lib/database";
import { apiKeyTable } from "$lib/schema";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ locals: { user } }) => {
  // Create API key in database
  if (!user) error(401);
  const [apiKey] = await db
    .insert(apiKeyTable)
    .values({
      userId: user.id,
      apiKey: crypto.randomBytes(32).toString("base64url"),
    })
    .returning();
  return json(apiKey);
};
