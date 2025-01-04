# Protected Pages

To create protected pages such that the user must be logged in (via session or API token), you need to modify `src/hooks.server.ts`.
By default, the `auth` hook in this file looks like this:

```ts
const auth: Handle = async ({ event, resolve }) => {
  // Extract user and session from cookies and Authorization header
  const { user, session } = await getUserAndSession(event.cookies, event.request.headers);
  event.locals.user = user;
  event.locals.session = session;
  return resolve(event);
};
```

By checking the URL after the user is verified, we can redirect them or return error if they're not authenticated.
Lets make any page that starts with `/dashboard` accessible for authenticated users only:

```ts
import { redirect, type Handle } from "@sveltejs/kit";

const auth: Handle = async ({ event, resolve }) => {
  // Extract user and session from cookies and Authorization header
  const { user, session } = await getUserAndSession(event.cookies, event.request.headers);
  event.locals.user = user;
  event.locals.session = session;

  // Only authenticated users can access /dashboard
  if (event.url.pathname.startsWith("/dashboard") && !user) {
    redirect(302, "/login");
  }

  return resolve(event);
};
```

Now the user will be redirected to `/login` if they try to access `/dashboard` and aren't logged in.

## Redirect back to page they tried to access

Ideally, the user should be redirected back to the page they tried to access when logging in, so lets modify this so they get properly redirected:

```ts
// Only authenticated users can access /dashboard
if (event.url.pathname.startsWith("/dashboard") && !user) {
  redirect(302, "/login?from=/dashboard");
}
```

Then in `src/routes/(auth)/login/+page.server.ts`, update the form action:

```ts
export const actions: Actions = {
  login: async ({ request, cookies, url }) => {
    // Validate form
    const loginForm = await superValidate(request, zod(authSchema));
    if (!loginForm.valid) return fail(400, { loginForm });
    const { email, password } = loginForm.data;

    // Login user
    try {
      await login(email, { password }, cookies);
    } catch (error) {
      return setError(loginForm, "password", "Invalid email/password or login method");
    }

    // Redirect to from if exists
    const from = url.searchParams.get("from");
    if (from && from.startsWith("/")) {
      redirect(303, from);
    } else {
      redirect(303, "/");
    }
  },
};
```
