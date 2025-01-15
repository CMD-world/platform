import { t } from "$lib/trpc/t";
import { commands } from "$lib/trpc/routes/commands";
import { workflows } from "$lib/trpc/routes/workflows";
import { eliza } from "$lib/trpc/routes/eliza";

export const router = t.router({
  commands,
  workflows,
  eliza,
});

export const createCaller = t.createCallerFactory(router);

export type Router = typeof router;
