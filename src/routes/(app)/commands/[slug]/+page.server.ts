import type { Actions, PageServerLoad } from "./$types";
import { error, fail } from "@sveltejs/kit";
import { db } from "$lib/database";
import { commandTable } from "$lib/schema";
import { eq, and } from "drizzle-orm";
import { workflowSchema } from "$forms/workflowSchema";
import { zod } from "sveltekit-superforms/adapters";
import { superValidate } from "sveltekit-superforms";

export const load: PageServerLoad = async ({ params: { slug }, locals: { user } }) => {
  // Get command
  if (!user) error(401);
  const commands = await db
    .select()
    .from(commandTable)
    .where(and(eq(commandTable.slug, slug), eq(commandTable.userId, user.id)));
  if (commands.length == 0) error(404);

  // Initialize form
  return {
    command: commands[0],
    workflowForm: await superValidate(zod(workflowSchema)),
  };
};

export const actions: Actions = {
  workflow: async ({ request }) => {
    // Validate form
    const workflowForm = await superValidate(request, zod(workflowSchema));
    if (!workflowForm.valid) return fail(400, { workflowForm });
    const { url } = workflowForm.data;
    console.log(url);
  },
};
