import { error, redirect } from "@sveltejs/kit";
import { env } from "$env/dynamic/public";
import { commandTable } from "$lib/schema";
import { db } from "$lib/database";
import { eq, and } from "drizzle-orm";
import type { RequestHandler } from "./$types";
import { trpc } from "$lib/trpc/server";

export const GET: RequestHandler = async (event) => {
  const {
    params: { slug },
    locals: { user },
  } = event;
  if (!user) error(401);

  // Get id for command
  const commands = await db
    .select()
    .from(commandTable)
    .where(and(eq(commandTable.slug, slug), eq(commandTable.userId, user.id)));
  if (commands.length == 0) error(404);
  const command = commands[0];

  // Create API key
  const { apiKey } = await trpc(event).then((client) => client.keys.create());

  const searchParams = new URLSearchParams({
    platform_key: apiKey,
    platform_id: command.id.toString(),
    model: "swarmforce",
    q: "Tell me what you can do for me!",
  });
  redirect(303, `${env.PUBLIC_CHAT_URL}?${searchParams.toString()}`);
};
