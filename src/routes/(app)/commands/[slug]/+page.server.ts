import type { Actions, PageServerLoad } from "./$types";
import { error, fail, redirect } from "@sveltejs/kit";
import { db } from "$lib/database";
import { commandTable, workflowTable } from "$lib/schema";
import { eq, and, asc } from "drizzle-orm";
import { workflowSchema } from "$forms/workflowSchema";
import { promptSchema } from "$forms/promptSchema";
import { zod } from "sveltekit-superforms/adapters";
import { setError, superValidate } from "sveltekit-superforms";
import { trpc } from "$lib/trpc/server";
import { openai } from "$lib/openai";

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
    promptForm: await superValidate(zod(promptSchema)),
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
    const commands = await db
      .select()
      .from(commandTable)
      .where(and(eq(commandTable.slug, slug), eq(commandTable.userId, user.id)));
    if (commands.length == 0) error(403);
    const command = commands[0];

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
  prompt: async (event) => {
    // Validate form
    const promptForm = await superValidate(event, zod(promptSchema));
    if (!promptForm.valid) return fail(400, { promptForm });
    const { prompt } = promptForm.data;

    // Generate response
    const response = await trpc(event).then((client) => client.commands.run({ slug: event.params.slug, prompt }));
    return {
      promptForm,
      response,
    };
  },
};
