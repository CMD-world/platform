import { t } from "$lib/trpc/t";
import { keys } from "$lib/trpc/routes/keys";
import { agents } from "$lib/trpc/routes/agents";

export const router = t.router({
  keys,
  agents,
});

export type Router = typeof router;
