import { z } from "zod";
import { initTRPC } from "@trpc/server";
import { type Context } from "$lib/trpc/context";
import { type OpenApiMeta } from "trpc-to-openapi";

export const t = initTRPC.context<Context>().meta<OpenApiMeta>().create();

export const router = t.router({
  keys: t.procedure
    .meta({ openapi: { method: "POST", path: "/keys" } })
    .input(z.void())
    .output(z.string())
    .query(async ({ ctx }) => {
      console.log(ctx.event.locals.user);
      return `Hello, ${ctx.event.locals.user}!`;
    }),
});

export type Router = typeof router;
