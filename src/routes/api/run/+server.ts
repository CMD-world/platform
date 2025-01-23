import type { RequestHandler } from "./$types";
import { commandTable, workflowTable } from "$lib/schema";
import { and, eq } from "drizzle-orm";
import { openai } from "$lib/openai";
import { db } from "$lib/database";

export const GET: RequestHandler = async ({ url }) => {
  const id = Number(url.searchParams.get("id"));
  const prompt = url.searchParams.get("prompt");

  const responseStream = new ReadableStream({
    async start(controller) {
      try {
        // Get command and workflows
        const command = await db
          .select()
          .from(commandTable)
          .where(and(eq(commandTable.id, id)))
          .then((rows) => rows[0]);

        if (!command) {
          controller.enqueue(`data: Command not found\n\n`);
          controller.close();
          return;
        }

        console.info(`Got command "${command.name}"`);

        const workflows = await db.select().from(workflowTable).where(eq(workflowTable.commandId, command.id));
        console.info(`Retrieved ${workflows.length} workflows`);

        // Analyze prompt
        const workflowExamples = JSON.stringify(
          workflows.map((w) => ({
            name: w.name,
            description: w.description,
            inputs: w.inputs,
          })),
          null,
          2,
        );
        console.info("Analyzing prompt...");

        const analysisPrompt = `
          Given these available workflows:
          ${workflowExamples}

          And this user prompt: "${prompt}"

          Analyze and return a JSON response. Try to find the best matching workflow even if not all inputs are perfectly clear.

          Required format:
          {
            "workflow": "name of the most suitable workflow or null if no reasonable match",
            "inputs": {
              // extracted input values - should match the workflow's inputs as closely as possible
              // use best effort to extract or infer missing inputs
            },
          }

          Rules:
          - Return the best matching workflow even with partial input matches
          - Make reasonable assumptions for unclear inputs
          - Fuzzy matching of workflow names is acceptable
          - Must be valid JSON parseable
          - No additional text or code blocks

          Try to find a workable match if possible.
        `;

        const analysis = await openai.chat.completions.create({
          model: "accounts/fireworks/models/qwen2p5-coder-32b-instruct",
          messages: [{ role: "user", content: analysisPrompt }],
        });

        const analysisContent = analysis.choices[0].message.content;
        const workflowAnalysis = JSON.parse(analysisContent || "{}");

        console.info(`Found matching workflow: "${workflowAnalysis.workflow}"`);

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
            model: "accounts/fireworks/models/qwen2p5-coder-32b-instruct",
            messages: [{ role: "user", content: failurePrompt }],
          });

          controller.enqueue(`data: ${failureResponse.choices[0].message.content}\n\n`);
          controller.close();
          return;
        }

        console.info("Executing workflow...");

        // Call workflow
        let workflowResult;
        try {
          const response = await fetch(selectedWorkflow.url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(workflowAnalysis.inputs),
          });

          if (!response.ok) {
            controller.enqueue(`data: Failed to process workflow: ${response.statusText}\n\n`);
            controller.close();
            return;
          }

          workflowResult = await response.json();
          console.info("Successfully called workflow");
        } catch (error) {
          controller.enqueue(`data: Error executing workflow: ${error.message}\n\n`);
          controller.close();
          return;
        }

        // Generate final response
        const finalPrompt = `
          Given:
          - Original user prompt: "${prompt}"
          - Workflow used: "${selectedWorkflow.name}"
          - Workflow result: ${JSON.stringify(workflowResult)}

          Create a helpful response that incorporates the workflow results using proper markdown formatting.
          Use paragraphs, bullet points, bold, and other markdown features as appropriate.
          Keep the response brief and well-structured.
          Format it as clean, simple markdown.
        `;

        const finalResponse = await openai.chat.completions.create({
          model: "accounts/fireworks/models/qwen2p5-coder-32b-instruct",
          messages: [{ role: "user", content: finalPrompt }],
          stream: true,
        });

        for await (const chunk of finalResponse) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            controller.enqueue(`data: ${JSON.stringify({ content })}\n\n`);
          }
        }
        controller.close();
      } catch (error) {
        controller.enqueue(`data: Error: ${error.message}\n\n`);
        controller.close();
      }
    },
  });

  return new Response(responseStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
};
