import type { Actions, PageServerLoad } from "./$types";
import { error, fail, redirect } from "@sveltejs/kit";
import { db } from "$lib/database";
import { commandTable, workflowTable } from "$lib/schema";
import { eq, and, asc } from "drizzle-orm";
import { workflowSchema } from "$forms/workflowSchema";
import { zod } from "sveltekit-superforms/adapters";
import { superValidate } from "sveltekit-superforms";
import { trpc } from "$lib/trpc/server";
import type { PrivyDbUser } from "$lib/privy";
import { commandSchema } from "$forms/commandSchema";

async function getCommandBySlug(slug: string, user: PrivyDbUser) {
  // Get command id
  if (!user) error(401);
  const commands = await db
    .select()
    .from(commandTable)
    .where(and(eq(commandTable.slug, slug), eq(commandTable.userId, user.id)));
  if (commands.length == 0) error(403);
  return commands[0];
}

export const load: PageServerLoad = async ({ params: { slug }, locals: { user } }) => {
  // Get command and workflows
  if (!user) error(401);
  const commands = await db
    .select()
    .from(commandTable)
    .where(and(eq(commandTable.slug, slug), eq(commandTable.userId, user.id)));
  if (commands.length == 0) error(404);
  const command = commands[0];
  const workflows = await db
    .select()
    .from(workflowTable)
    .where(eq(workflowTable.commandId, command.id))
    .orderBy(asc(workflowTable.createdAt));

  // Initialize form
  return {
    command,
    workflows,
    commandForm: await superValidate(command, zod(commandSchema), { errors: false }),
    workflowForm: await superValidate(zod(workflowSchema)),
  };
};

export const actions: Actions = {
  workflow: async (event) => {
    // Validate form
    const {
      params: { slug },
      locals: { user },
    } = event;
    const workflowForm = await superValidate(event, zod(workflowSchema));
    if (!workflowForm.valid) return fail(400, { workflowForm });
    const workflow = workflowForm.data;

    // Get command id
    if (!user) error(401);
    const command = await getCommandBySlug(slug, user);

    // Update or create workflow
    await trpc(event).then((client) => {
      if (workflow.id) {
        client.workflows.update(workflow);
      } else {
        client.workflows.create({
          commandId: command.id,
          workflow,
        });
      }
    });
    return { workflowForm };
  },
  command: async (event) => {
    // Validate form
    const {
      params: { slug },
      locals: { user },
    } = event;
    const commandForm = await superValidate(event, zod(commandSchema));
    if (!commandForm.valid) return fail(400, { commandForm });
    const { name, description } = commandForm.data;

    // Update command
    if (!user) error(401);
    const command = await getCommandBySlug(slug, user);
    const newCommand = await trpc(event).then((client) => client.commands.update({ id: command.id, name, description }));
    throw redirect(303, `/commands/${newCommand.slug}`);
  },
};
