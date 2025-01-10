import { t } from "$lib/trpc/t";
import { keys } from "$lib/trpc/routes/keys";

export const router = t.router({
  keys,
});

export type Router = typeof router;
