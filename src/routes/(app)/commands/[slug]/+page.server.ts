import type { Actions, PageServerLoad } from "./$types";
import { error, fail, redirect } from "@sveltejs/kit";
import { db } from "$lib/database";
import { commandTable, workflowTable } from "$lib/schema";
import { eq, and, desc } from "drizzle-orm";
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
    .orderBy(desc(workflowTable.createdAt));

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
  prompt: async ({ request, params: { slug }, locals: { user } }) => {
    // Validate form
    const promptForm = await superValidate(request, zod(promptSchema));
    if (!promptForm.valid) return fail(400, { promptForm });
    const { prompt } = promptForm.data;

    // Get command and workflows
    if (!user) error(401);
    const commands = await db
      .select()
      .from(commandTable)
      .where(and(eq(commandTable.slug, slug), eq(commandTable.userId, user.id)));
    if (commands.length == 0) error(403);
    const command = commands[0];
    const workflows = await db.select().from(workflowTable).where(eq(workflowTable.commandId, command.id));

    // Ask LLM to analyze prompt and select workflow + extract inputs
    const analysisPrompt = `
      Given these available workflows:
      ${JSON.stringify(
        workflows.map((w) => ({
          name: w.name,
          inputs: w.inputs,
          outputs: w.outputs,
        })),
      )}

      And this user prompt: "${prompt}"

      Please analyze and return a JSON response in this format:
      {
        "workflow": "name of the most suitable workflow or null if none matches",
        "inputs": {
          // extracted input values based on the selected workflow's required inputs, must match exactly the same format
        },
      }

      Only return this JSON response and nothing else, even without code blocks.
      It must be exactly what a JSON parser would expect.
      If there's no matching workflow, return null.
    `;

    const analysis = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: analysisPrompt }],
    });
    const workflowAnalysis = JSON.parse(analysis.choices[0].message.content || "{}");
    console.log(workflowAnalysis);

    // Get the selected workflow
    const selectedWorkflow = workflows.find((w) => w.name === workflowAnalysis.workflow);
    if (!selectedWorkflow) return setError(promptForm, "prompt", "There was an error identifying the workflow.");

    // Call the workflow URL with extracted inputs
    console.log(selectedWorkflow.url);
    console.log(workflowAnalysis.inputs);
    const response = await fetch(selectedWorkflow.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workflowAnalysis.inputs),
    });
    if (!response.ok) {
      return setError(promptForm, "prompt", `Workflow request failed: ${response.statusText}`);
    }

    // Generate final response using workflow result as context
    const workflowResult = await response.json();
    const finalPrompt = `
      Given:
      - Original user prompt: "${prompt}"
      - Workflow used: "${selectedWorkflow.name}"
      - Workflow result: ${JSON.stringify(workflowResult)}
      - Workflow outputs schema: ${JSON.stringify(selectedWorkflow.outputs)}

      Please provide a helpful response that incorporates the workflow results.
      Don't use any codeblocks or anything, just return simple HTML.
      Keep the response brief and to the point.
    `;

    const finalResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: finalPrompt }],
    });

    return {
      message: finalResponse.choices[0].message.content,
      promptForm,
    };
  },
};
