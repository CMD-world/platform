import { z } from "zod";
import { initTRPC } from "@trpc/server";
import { type Context } from "$lib/trpc/context";
import { type OpenApiMeta } from "trpc-to-openapi";

export const t = initTRPC.context<Context>().meta<OpenApiMeta>().create({
  allowOutsideOfServer: true,
});

export const router = t.router({
  greeting: t.procedure
    .meta({ openapi: { method: "GET", path: "/greeting" } })
    .input(z.object({ name: z.string() }))
    .output(z.string())
    .query(async ({ input }) => {
      return `Hello, ${input.name}!`;
    }),
});

export type Router = typeof router;
