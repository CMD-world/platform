import { redirect, type Handle } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import { sequence } from "@sveltejs/kit/hooks";
import { privy } from "$lib/privy";
import * as Sentry from "@sentry/sveltekit";

const auth: Handle = async ({ event, resolve }) => {
  // Extract user from Privy token
  const idToken = event.cookies.get("privy-id-token");
  event.locals.user = idToken ? await privy.getUser({ idToken }) : null;

  // Restrict access to dashboard
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
