import { redirect, type Handle } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import { getUserAndSession } from "$lib/auth";
import { sequence } from "@sveltejs/kit/hooks";
import * as Sentry from "@sentry/sveltekit";

const auth: Handle = async ({ event, resolve }) => {
  // Extract user and session from cookies and Authorization header
  const { user, session } = await getUserAndSession(event.cookies, event.request.headers);
  event.locals.user = user;
  event.locals.session = session;

  // If user is logged in and tries to access login/register pages, redirect to dashboard
  const path = event.url.pathname;
  if (user && (path == "/login" || path == "/register")) {
    throw redirect(303, "/dashboard");
  }

  // If user is not logged in and tries to access dashboard, redirect to home
  if (!user && path.startsWith("/dashboard")) {
    throw redirect(303, "/");
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
