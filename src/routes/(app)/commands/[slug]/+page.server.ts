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
    const workflowExamples = JSON.stringify(
      workflows.map((w) => ({
        name: w.name,
        inputs: w.inputs,
        outputs: w.outputs,
      })),
      null,
      2,
    );
    const analysisPrompt = `
      Given these available workflows:
      ${workflowExamples}

      And this user prompt: "${prompt}"

      Strictly analyze and return a JSON response. BE CONSERVATIVE in matching - if there is ANY doubt or missing information, return null.

      Required format:
      {
        "workflow": "name of the most suitable workflow or null if ANY uncertainty",
        "inputs": {
          // extracted input values - must EXACTLY match the workflow's required inputs
          // if ANY required input is missing or unclear, return null instead
        },
      }

      Rules:
      - Return null unless there is a PERFECT match with ALL required inputs
      - No partial matches allowed
      - Missing or ambiguous inputs = null
      - Only exact workflow name matches
      - Must be valid JSON parseable
      - No additional text or code blocks

      If in doubt, return null.
    `;

    const analysis = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: analysisPrompt }],
    });
    const workflowAnalysis = JSON.parse(analysis.choices[0].message.content || "{}");
    console.log(workflowAnalysis);

    // Get the selected workflow
    const selectedWorkflow = workflows.find((w) => w.name === workflowAnalysis.workflow);
    if (!selectedWorkflow) {
      // Generate a failure response
      const failurePrompt = `
        The user asked: "${prompt}"

        Given these workflows and their required inputs:
        ${workflowExamples}

        First, try to determine if the user's prompt partially matches any workflow but is missing some required inputs.
        Then, provide a brief, friendly response in clean HTML format that either:

        1. If there's a partial match:
           Create a response with:
           - A <p> explaining which workflow they were trying to use
           - A <ul> listing the specific required inputs that are missing

        2. If there's no match at all:
           Create a response with:
           - A <p> explaining we couldn't process their request
           - A <ul> listing the available workflows

        Use only basic HTML tags (<p>, <ul>, <li>).
        No markdown or complex formatting.
        Keep the response brief and actionable.
      `;

      const failureResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: failurePrompt }],
      });

      return {
        message: failureResponse.choices[0].message.content,
        promptForm,
      };
    }

    // Call the workflow URL with extracted inputs
    console.info("Calling this workflow:", selectedWorkflow);
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
    console.info("Got result:", workflowResult);
    const finalPrompt = `
      Given:
      - Original user prompt: "${prompt}"
      - Workflow used: "${selectedWorkflow.name}"
      - Workflow result: ${JSON.stringify(workflowResult)}
      - Workflow outputs schema: ${JSON.stringify(selectedWorkflow.outputs)}

      Create a helpful response that incorporates the workflow results using only basic HTML tags (<p>, <ul>, <li>).
      Do not use markdown, code blocks or complex formatting.
      Keep the response brief and format it as clean, simple HTML.
      Structure the response with proper paragraphs using <p> tags.
      If you need a list, use <ul> and <li> tags.
    `;

    const finalResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: finalPrompt }],
    });

    return {
      message: finalResponse.choices[0].message.content?.trim(),
      promptForm,
    };
  },
};
