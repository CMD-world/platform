import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { db } from "$lib/database";
import { commandTable } from "$lib/schema";
import { eq, and } from "drizzle-orm";

export const load: PageServerLoad = async ({ params: { slug }, locals: { user } }) => {
  // Get command
  if (!user) error(401);
  const commands = await db
    .select()
    .from(commandTable)
    .where(and(eq(commandTable.slug, slug), eq(commandTable.userId, user.id)));
  if (commands.length == 0) error(404);
  return {
    command: commands[0],
  };
};
