import type { RequestEvent } from "@sveltejs/kit";
import { createCaller } from "$lib/trpc/router";
import { createContext } from "$lib/trpc/context";

export async function trpc(event: RequestEvent) {
  return createCaller(await createContext(event));
}
