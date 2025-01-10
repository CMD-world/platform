import { json, redirect, type Handle } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import { sequence } from "@sveltejs/kit/hooks";
import { getOrCreateUser } from "$lib/privy";
import { createContext } from "$lib/trpc/context";
import { router } from "$lib/trpc/router";
import { createTRPCHandle } from "trpc-sveltekit";

const auth: Handle = async ({ event, resolve }) => {
  // Get user, restrict access to certain pages
  event.locals.user = await getOrCreateUser(event.cookies, event.request.headers.get("Authorization"));
  if (!event.locals.user && event.url.pathname.startsWith("/api")) {
    return json({ message: "Missing API token in Authorization header or not authenticated" }, { status: 401 });
  }
  if (!event.locals.user && event.url.pathname.startsWith("/dashboard")) {
    return redirect(303, "/");
  }
  return resolve(event);
};

export const handle = sequence(createTRPCHandle({ router, createContext }), auth);
