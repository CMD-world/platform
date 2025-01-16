import { t } from "$lib/trpc/t";
import { keys } from "$lib/trpc/routes/keys";
import { eliza } from "$lib/trpc/routes/eliza";
import { commands } from "$lib/trpc/routes/commands";
import { workflows } from "$lib/trpc/routes/workflows";

export const router = t.router({
  keys,
  eliza,
  commands,
  workflows,
});

export const createCaller = t.createCallerFactory(router);

export type Router = typeof router;
