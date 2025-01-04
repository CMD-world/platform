import type { RequestHandler } from "./$types";
import { GitHub } from "arctic";
import { generateState } from "arctic";
import { error, redirect } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";

export const GET: RequestHandler = async ({ url: { origin }, cookies }) => {
  // Create URL
  const state = generateState();
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) error(400, "Github is not setup.");
  const github = new GitHub(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET, `${origin}/github/callback`);
  const url = github.createAuthorizationURL(state, ["user:email"]);

  // Store state in cookies for later
  cookies.set("github_state", state, { httpOnly: true, maxAge: 600, secure: import.meta.env.PROD, path: "/", sameSite: "lax" });

  // Goto URL
  redirect(303, url);
};
