import type { RequestHandler } from "./$types";
import { Google } from "arctic";
import { generateCodeVerifier, generateState } from "arctic";
import { error, redirect } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";

export const GET: RequestHandler = async ({ url: { origin }, cookies }) => {
  // Create URL
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) error(400, "Google client id and secret is missing");
  const google = new Google(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET, `${origin}/google/callback`);
  const url = google.createAuthorizationURL(state, codeVerifier, ["openid", "email"]);

  // Store state and verifier in cookies for later
  cookies.set("google_state", state, { httpOnly: true, maxAge: 600, secure: import.meta.env.PROD, path: "/", sameSite: "lax" });
  cookies.set("google_verifier", codeVerifier, { httpOnly: true, maxAge: 600, secure: import.meta.env.PROD, path: "/", sameSite: "lax" });

  // Goto URL
  redirect(303, url);
};
