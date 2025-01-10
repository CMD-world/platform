import { initTRPC } from "@trpc/server";
import type { Context } from "$lib/trpc/context";
import type { OpenApiMeta } from "trpc-to-openapi";

export const t = initTRPC.context<Context>().meta<OpenApiMeta>().create();
