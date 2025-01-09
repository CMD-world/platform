import crypto from "crypto";
import { error, json } from "@sveltejs/kit";
import { db } from "$lib/database";
import { apiKeyTable } from "$lib/schema";
import type { RequestHandler } from "./$types";

type CreateApiKey = {
  expiresAt?: Date;
};

export const POST: RequestHandler = async ({ request, locals: { user } }) => {
  // Generate API key
  if (!user) error(401);
  const body = await request.json();
  const { expiresAt } = body as CreateApiKey;

  // Create API key in database
  const [apiKey] = await db
    .insert(apiKeyTable)
    .values({
      userId: user.id,
      apiKey: crypto.randomBytes(32).toString("base64url"),
      expiresAt: expiresAt,
    })
    .returning();
  return json(apiKey);
};
