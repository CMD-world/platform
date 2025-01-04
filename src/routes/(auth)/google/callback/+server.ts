import type { RequestHandler } from "./$types";
import { ObjectParser } from "@pilcrowjs/object-parser";
import { Google, decodeIdToken } from "arctic";
import { env } from "$env/dynamic/private";
import { error, redirect } from "@sveltejs/kit";
import { db } from "$lib/database";
import { userTable } from "$lib/schema";
import { eq, and } from "drizzle-orm";
import { login, register } from "$lib/auth";

export const GET: RequestHandler = async ({ url: { origin, searchParams }, cookies }) => {
  // Get data from callback URL
  const storedState = cookies.get("google_state");
  const codeVerifier = cookies.get("google_verifier");
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) error(400, "Google client id and secret is missing");
  if (!storedState || !codeVerifier || !code || !state || storedState !== state) error(400, "Please restart the process.");

  // Parse tokens
  const google = new Google(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET, `${origin}/google/callback`);
  const tokens = await google.validateAuthorizationCode(code, codeVerifier);
  const claims = decodeIdToken(tokens.idToken());
  const claimsParser = new ObjectParser(claims);

  // Get user data
  const googleId = claimsParser.getString("sub");
  const email = claimsParser.getString("email");

  // Check if user exists
  const users = await db
    .select()
    .from(userTable)
    .where(and(eq(userTable.method, "google"), eq(userTable.data, googleId), eq(userTable.email, email)));
  if (users.length > 0) {
    // User exists, log them in
    await login(email, { googleId }, cookies);
  } else {
    // Create user then login
    await register(email, { googleId });
    await login(email, { googleId }, cookies);
  }
  redirect(303, "/");
};
