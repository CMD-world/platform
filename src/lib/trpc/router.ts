import { t } from "$lib/trpc/t";
import { eliza } from "$lib/trpc/routes/eliza";
import { commands } from "$lib/trpc/routes/commands";
// import { workflows } from "$lib/trpc/routes/workflows";

export const router = t.router({
  eliza,
  commands,
  // "create-eliza": createEliza,
  // workflows,
});

export const createCaller = t.createCallerFactory(router);

export type Router = typeof router;
