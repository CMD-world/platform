import { t } from "./t";
import type { RequestEvent } from "@sveltejs/kit";
import { TRPCError, type inferAsyncReturnType } from "@trpc/server";

export async function createContext(event: RequestEvent) {
  return { event, user: event.locals.user };
}

export type Context = inferAsyncReturnType<typeof createContext>;

// Procedure where user must be logged in
export const privateProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this endpoint",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});
