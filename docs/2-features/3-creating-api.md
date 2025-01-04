# Creating API

If you need to expose an API that your users can use, you can create an API folder in `src/routes/api` and put your routes here.
For instance, if you want to display the sessions attached to the current user as JSON, create `src/routes/api/sessions/+server.ts` and write following:

```ts
import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";
import { db } from "$lib/database";
import { sessionTable } from "$lib/schema";
import { eq } from "drizzle-orm";

export const GET: RequestHandler = async ({ locals: { user } }) => {
  if (user) {
    const sessions = await db.select().from(sessionTable).where(eq(sessionTable.userId, user.id));
    return json({ sessions });
  } else {
    return json({ error: "User is not authenticated" });
  }
};
```

Now you can call the API by sending a GET request to `/api/sessions`. To create an API token, see [API Token](3-api-token.md).
To learn more about API routes in SvelteKit, see [+server](https://svelte.dev/docs/kit/routing#server).
