# User authentication

This project supports authentication with email & password and OAuth.
The session id is stored in `cookies`, and validated on the server to get the users details.

## Access user on client

On the client, the current user is stored in `data.user`.
For instance, to show the users email on the page, write following:

```svelte
<script lang="ts">
  // Props
  const { data } = $props();
  const { user } = $derived(data);
</script>

{#if user}
  <p>Your email is {user.email}</p>
{:else}
  <p>You're not logged in</p>
{/if}
```

## Access user on server

On the server, the current user is stored in `locals.user`.
For instance, to log the current users email on the server when page loads, write following:

```ts
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals: { user } }) => {
  console.log("Current users email is:", user?.email);
};
```

## Add GitHub/Google OAuth

To add GitHub/Google OAuth, follow the OAuth section in the [Production guide](../1-tutorials/2-production.md#add-googlegithub-oauth).
