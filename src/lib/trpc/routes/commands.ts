import { z } from "zod";
import { kebabCase } from "change-case";
import { t } from "$lib/trpc/t";
import { db } from "$lib/database";
import { commandTable, workflowTable } from "$lib/schema";
import { commandSchema } from "$forms/commandSchema";
import { privateProcedure } from "$lib/trpc/context";
import { createSelectSchema } from "drizzle-zod";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { openai } from "$lib/openai";

export const commands = t.router({
  run: privateProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/commands.run",
        tags: ["Commands"],
        description: "Run a command with a prompt.",
      },
    })
    .input(
      z.object({
        slug: z.string(),
        prompt: z.string(),
      }),
    )
    .output(z.string())
    .mutation(async ({ ctx: { user }, input: { slug, prompt } }) => {
      // Get command and workflows
      const command = await db
        .select()
        .from(commandTable)
        .where(and(eq(commandTable.slug, slug), eq(commandTable.userId, user.id)))
        .then((rows) => rows[0]);

      if (!command) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Command not found",
        });
      }

      const workflows = await db.select().from(workflowTable).where(eq(workflowTable.commandId, command.id));

      // Analyze prompt
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
        model: "accounts/fireworks/models/deepseek-v3",
        messages: [{ role: "user", content: analysisPrompt }],
      });

      const workflowAnalysis = JSON.parse(analysis.choices[0].message.content || "{}");

      // Get selected workflow
      const selectedWorkflow = workflows.find((w) => w.name === workflowAnalysis.workflow);
      if (!selectedWorkflow) {
        const failurePrompt = `
            The user asked: "${prompt}"

            Given these workflows and their required inputs:
            ${workflowExamples}

            First, try to determine if the user's prompt partially matches any workflow but is missing some required inputs.
            Then, provide a brief, friendly response in markdown format that either:

            1. If there's a partial match:
               Create a response with:
               - A paragraph explaining which workflow they were trying to use
               - A bullet list of the specific required inputs that are missing

            2. If there's no match at all:
               Create a response with:
               - A paragraph explaining we couldn't process their request
               - A bullet list of the available workflows

            Use proper markdown formatting.
            Keep the response brief and actionable.
          `;

        const failureResponse = await openai.chat.completions.create({
          model: "accounts/fireworks/models/deepseek-v3",
          messages: [{ role: "user", content: failurePrompt }],
        });

        return failureResponse.choices[0].message.content || "";
      }

      // Call workflow
      const response = await fetch(selectedWorkflow.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workflowAnalysis.inputs),
      });

      if (!response.ok) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error calling workflow: ${response.statusText}`,
        });
      }

      const workflowResult = await response.json();

      // Generate final response
      const finalPrompt = `
          Given:
          - Original user prompt: "${prompt}"
          - Workflow used: "${selectedWorkflow.name}"
          - Workflow result: ${JSON.stringify(workflowResult)}
          - Workflow outputs schema: ${JSON.stringify(selectedWorkflow.outputs)}

          Create a helpful response that incorporates the workflow results using proper markdown formatting.
          Use paragraphs, bullet points, bold, and other markdown features as appropriate.
          Keep the response brief and well-structured.
          Format it as clean, simple markdown.
        `;

      const finalResponse = await openai.chat.completions.create({
        model: "accounts/fireworks/models/deepseek-v3",
        messages: [{ role: "user", content: finalPrompt }],
      });

      return finalResponse.choices[0].message.content?.trim() || "";
    }),

  create: privateProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/commands.create",
        tags: ["Commands"],
        description: "Create new command for user.",
      },
    })
    .input(commandSchema)
    .output(createSelectSchema(commandTable))
    .mutation(async ({ ctx: { user }, input: { name } }) => {
      const [command] = await db
        .insert(commandTable)
        .values({
          name,
          slug: kebabCase(name),
          userId: user.id,
        })
        .returning();
      return command;
    }),

  update: privateProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/commands.update",
        tags: ["Commands"],
        description: "Update an existing command for user.",
      },
    })
    .input(commandSchema)
    .output(createSelectSchema(commandTable))
    .mutation(async ({ ctx: { user }, input: { id, name } }) => {
      if (!id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Command ID is required for updates",
        });
      }

      const [command] = await db
        .update(commandTable)
        .set({
          name: name,
          slug: kebabCase(name),
        })
        .where(and(eq(commandTable.id, id), eq(commandTable.userId, user.id)))
        .returning();
      return command;
    }),

  delete: privateProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/commands.delete",
        tags: ["Commands"],
        description: "Delete a command for user.",
      },
    })
    .input(commandSchema.pick({ id: true }))
    .output(
      z.object({
        deleted: z.boolean(),
      }),
    )
    .mutation(async ({ ctx: { user }, input: { id } }) => {
      if (!id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Command ID is required for deletion",
        });
      }
      const commands = await db
        .delete(commandTable)
        .where(and(eq(commandTable.id, id), eq(commandTable.userId, user.id)))
        .returning();
      return { deleted: commands.length > 0 };
    }),
});
