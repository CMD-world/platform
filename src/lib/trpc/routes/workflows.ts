import { z } from "zod";
import { db } from "$lib/database";
import { workflowTable } from "$lib/schema";
import { createSelectSchema } from "drizzle-zod";
import { workflowSchema } from "$forms/workflowSchema";
import { privateProcedure } from "$lib/trpc/context";

export const createWorkflowSchema = z.object({
  commandId: z.number(),
  workflow: workflowSchema,
});

export const workflows = privateProcedure
  .meta({
    openapi: {
      method: "POST",
      path: "/workflows",
      tags: ["Workflows"],
      description: "Create new workflow for user.",
    },
  })
  .input(createWorkflowSchema)
  .output(createSelectSchema(workflowTable))
  .mutation(async ({ input: { commandId, workflow } }) => {
    const [newWorkflow] = await db
      .insert(workflowTable)
      .values({
        commandId,
        url: workflow.url,
        inputs: workflow.inputs,
        outputs: workflow.outputs,
      })
      .returning();
    return newWorkflow;
  });
