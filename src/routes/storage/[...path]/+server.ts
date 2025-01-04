import { storage } from "$lib/storage";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params: { path } }) => {
  const stream = await storage.readToBuffer(path);
  return new Response(stream);
};
