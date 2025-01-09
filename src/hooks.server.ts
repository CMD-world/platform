import { json, redirect, type Handle } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import { sequence } from "@sveltejs/kit/hooks";
import { getOrCreateUser } from "$lib/privy";
import * as Sentry from "@sentry/sveltekit";

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

// Setup Sentry
Sentry.init({
  dsn: env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

export const handleError = Sentry.handleErrorWithSentry();
export const handle = sequence(Sentry.sentryHandle(), auth);
