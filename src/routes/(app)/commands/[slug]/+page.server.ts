import type { Actions, PageServerLoad } from "./$types";
import { error, fail, redirect } from "@sveltejs/kit";
import { db } from "$lib/database";
import { commandTable, workflowTable } from "$lib/schema";
import { eq, and } from "drizzle-orm";
import { workflowSchema } from "$forms/workflowSchema";
import { promptSchema } from "$forms/promptSchema";
import { zod } from "sveltekit-superforms/adapters";
import { superValidate } from "sveltekit-superforms";
import { trpc } from "$lib/trpc/server";
import { openai } from "$lib/openai";

export const load: PageServerLoad = async ({ params: { slug }, locals: { user } }) => {
  // Get command
  if (!user) error(401);
  const commands = await db
    .select()
    .from(commandTable)
    .where(and(eq(commandTable.slug, slug), eq(commandTable.userId, user.id)));
  if (commands.length == 0) error(404);
  const command = commands[0];

  // Get workflows
  const workflows = await db.select().from(workflowTable).where(eq(workflowTable.commandId, command.id));

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

    // Get command id
    if (!user) error(401);
    const commands = await db
      .select()
      .from(commandTable)
      .where(and(eq(commandTable.slug, slug), eq(commandTable.userId, user.id)));
    if (commands.length == 0) error(403);

    // Create workflow and redirect to it
    const workflow = await trpc(event).then((client) =>
      client.workflows({
        commandId: commands[0].id,
        workflow: workflowForm.data,
      }),
    );
    throw redirect(303, `/commands/${slug}`);
  },
  prompt: async ({ request }) => {
    // Validate form
    const promptForm = await superValidate(request, zod(promptSchema));
    if (!promptForm.valid) return fail(400, { promptForm });
    const { prompt } = promptForm.data;

    // Send prompt to LLM
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });
    const message = response.choices.length > 0 ? response.choices[0].message.content : null;
    return {
      message,
      promptForm,
    };
  },
};
