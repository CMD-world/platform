import { error, redirect, type Handle } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import { sequence } from "@sveltejs/kit/hooks";
import { getOrCreateUser } from "$lib/privy";
import * as Sentry from "@sentry/sveltekit";

const auth: Handle = async ({ event, resolve }) => {
  // Get user, restrict access to certain pages
  event.locals.user = await getOrCreateUser(event.cookies);
  // if (!event.locals.user && event.url.pathname.startsWith("/api")) {
  //   error(401, { message: "Missing API token or not authenticated" });
  // }
  if (!event.locals.user && event.url.pathname.startsWith("/dashboard")) {
    redirect(303, "/");
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
