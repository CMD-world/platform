import { router } from "$lib/trpc/router";
import { createContext } from "$lib/trpc/context";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { RequestEvent, RequestHandler } from "./$types";

const handler: RequestHandler = (event: RequestEvent) =>
  fetchRequestHandler({
    endpoint: "/api",
    req: event.request,
    router,
    createContext: () => createContext(event),
  });

export { handler as GET, handler as POST };
