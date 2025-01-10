import { router } from "$lib/trpc/router";
import { createContext } from "$lib/trpc/context";
import { createTRPCHandle } from "trpc-sveltekit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = createTRPCHandle({ router, createContext });
export const POST: RequestHandler = createTRPCHandle({ router, createContext });
