import type { Actions, PageServerLoad } from "./$types";
import { commandSchema } from "$forms/commandSchema";
import { zod } from "sveltekit-superforms/adapters";
import { fail, superValidate } from "sveltekit-superforms";
import { trpc } from "$lib/trpc/server";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async () => {
  // Initialize form
  return {
    commandForm: await superValidate(zod(commandSchema)),
  };
};

export const actions: Actions = {
  command: async (event) => {
    // Validate form
    const { request } = event;
    const commandForm = await superValidate(request, zod(commandSchema));
    if (!commandForm.valid) return fail(400, { commandForm });
    const { name } = commandForm.data;

    // Create command then redirect to it
    const command = await trpc(event).then((client) => client.commands({ name }));
    throw redirect(303, `/dashboard/commands/${command.slug}`);
  },
};
