# API Token

You can make an API token for users with the `generateApiToken` function from `$lib/auth`.
When this function is called, it returns a token that never expires.
To use the API token, add it to the `Authorization` header like this: `Authorization: Bearer <token>`.

Here's a simple route that returns a new API token as JSON when you're logged in.
To try it, save it to `src/routes/api/token/+server.ts` and visit `/api/token`.

```ts
import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";
import { generateApiToken, logout } from "$lib/auth";

export const GET: RequestHandler = async ({ locals: { user } }) => {
  if (user) {
    const token = await generateApiToken(user.id);
    return json({ token });
  } else {
    return json({ error: "User is not authenticated" });
  }
};
```
