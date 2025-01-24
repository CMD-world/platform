import type { PageServerLoad } from "./$types";
import { db } from "$lib/database";
import { commandTable } from "$lib/schema";
import { eq, asc, and } from "drizzle-orm";

export const load: PageServerLoad = async ({ params: { commandId } }) => {
  // Get command
  const [command] = await db
    .select()
    .from(commandTable)
    .where(and(eq(commandTable.id, Number(commandId)), eq(commandTable.published, true)))
    .orderBy(asc(commandTable.createdAt));
  return { command };
};
