import { storage } from "$lib/storage";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params: { path }, locals: { user } }) => {
  if (user && path.startsWith(`${user.id}/`)) {
    const stream = await storage.readToBuffer(path);
    return new Response(stream);
  } else {
    return new Response(null, { status: 403 });
  }
};
