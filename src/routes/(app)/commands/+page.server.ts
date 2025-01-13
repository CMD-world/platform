import type { Actions, PageServerLoad } from "./$types";
import { commandSchema } from "$forms/commandSchema";
import { zod } from "sveltekit-superforms/adapters";
import { fail, superValidate } from "sveltekit-superforms";
import { error, redirect } from "@sveltejs/kit";
import { trpc } from "$lib/trpc/server";
import { db } from "$lib/database";
import { commandTable } from "$lib/schema";
import { eq } from "drizzle-orm";

export const load: PageServerLoad = async ({ locals: { user } }) => {
  // Load commands for user
  if (!user) error(403);
  const commands = await db.select().from(commandTable).where(eq(commandTable.userId, user.id));
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
    const command = await trpc(event).then((client) => client.commands({ name }));
    throw redirect(303, `/commands/${command.slug}`);
  },
};
