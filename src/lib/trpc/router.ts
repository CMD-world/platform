import { t } from "$lib/trpc/t";
import { keys } from "$lib/trpc/routes/keys";
import { commands } from "$lib/trpc/routes/commands";

export const router = t.router({
  keys,
  commands,
});

export const createCaller = t.createCallerFactory(router);

export type Router = typeof router;
