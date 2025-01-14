import type { Actions, PageServerLoad } from "./$types";
import { commandSchema } from "$forms/commandSchema";
import { zod } from "sveltekit-superforms/adapters";
import { fail, superValidate } from "sveltekit-superforms";
import { error, redirect } from "@sveltejs/kit";
import { trpc } from "$lib/trpc/server";
import { db } from "$lib/database";
import { commandTable, workflowTable } from "$lib/schema";
import { eq, sql } from "drizzle-orm";

export const load: PageServerLoad = async ({ locals: { user } }) => {
  // Load commands for user
  if (!user) error(403);
  const commands = await db
    .select({
      command: commandTable,
      workflows: sql<number>`count(${workflowTable.id})`,
    })
    .from(commandTable)
    .leftJoin(workflowTable, eq(workflowTable.commandId, commandTable.id))
    .where(eq(commandTable.userId, user.id))
    .groupBy(commandTable.id);
  return {
    commands,
    commandForm: await superValidate(zod(commandSchema)),
  };
};

export const actions: Actions = {
  command: async (event) => {
    // Validate form
    const commandForm = await superValidate(event, zod(commandSchema));
    if (!commandForm.valid) return fail(400, { commandForm });
    const { name } = commandForm.data;

    // Create command then redirect to it
    const command = await trpc(event).then((client) => client.commands.create({ name }));
    throw redirect(303, `/commands/${command.slug}`);
  },
};
