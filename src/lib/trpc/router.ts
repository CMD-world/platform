import { t } from "$lib/trpc/t";
import { commands } from "$lib/trpc/routes/commands";
import { workflows } from "$lib/trpc/routes/workflows";

export const router = t.router({
  commands,
  workflows,
});

export const createCaller = t.createCallerFactory(router);

export type Router = typeof router;
