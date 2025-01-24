import type { PageServerLoad } from "./$types";
import { searchSchema } from "$forms/searchSchema";
import { zod } from "sveltekit-superforms/adapters";
import { superValidate } from "sveltekit-superforms";
import { db } from "$lib/database";
import { commandTable } from "$lib/schema";
import { eq, asc } from "drizzle-orm";

export const load: PageServerLoad = async () => {
  // Get commands
  const commands = await db.select().from(commandTable).where(eq(commandTable.published, true)).orderBy(asc(commandTable.createdAt));

  // Initialize form
  return {
    commands,
    searchForm: await superValidate(zod(searchSchema)),
  };
};
