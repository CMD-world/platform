import { type RequestEvent } from "@sveltejs/kit";
import { type inferAsyncReturnType } from "@trpc/server";

export async function createContext(event: RequestEvent) {
  return { event, user: event.locals.user };
}

export type Context = inferAsyncReturnType<typeof createContext>;
