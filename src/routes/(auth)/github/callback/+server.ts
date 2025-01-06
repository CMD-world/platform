import type { RequestHandler } from "./$types";
import { GitHub } from "arctic";
import { env } from "$env/dynamic/private";
import { error, redirect } from "@sveltejs/kit";
import { db } from "$lib/database";
import { userTable } from "$lib/schema";
import { eq, and } from "drizzle-orm";
import { login, register } from "$lib/auth";

type GitHubEmail = {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string;
};

export const GET: RequestHandler = async ({ url: { origin, searchParams }, cookies }) => {
  // Get data from callback URL
  const storedState = cookies.get("github_state");
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  if (!storedState || !code || !state || storedState !== state) error(400, "Please restart the process.");

  // Parse tokens
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) error(400, "GitHub is not setup.");
  const github = new GitHub(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET, `${origin}/github/callback`);
  const tokens = await github.validateAuthorizationCode(code);
  const accessToken = tokens.accessToken();

  // Fetch user and email data
  const [user, emails] = await Promise.all([
    fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((response) => response.json()),
    fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((response) => response.json()),
  ]);
  const githubId = user.id;
  const primary = emails.find((email: GitHubEmail) => email.primary && email.verified);
  if (!githubId || !primary) error(400, "No GitHub ID or primary email found for account");

  // Check if user exists
  const users = await db
    .select()
    .from(userTable)
    .where(and(eq(userTable.method, "github"), eq(userTable.data, githubId), eq(userTable.email, primary.email)));
  if (users.length > 0) {
    // User exists, log them in
    await login(primary.email, { githubId }, cookies);
  } else {
    // Create user then login
    await register(primary.email, { githubId });
    await login(primary.email, { githubId }, cookies);
  }
  redirect(303, "/dashboard");
};
