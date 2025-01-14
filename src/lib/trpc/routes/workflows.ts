import { kebabCase } from "change-case";
import { z } from "zod";
import { db } from "$lib/database";
import { workflowTable } from "$lib/schema";
import { createSelectSchema } from "drizzle-zod";
import { workflowSchema } from "$forms/workflowSchema";
import { privateProcedure } from "$lib/trpc/context";
import { eq } from "drizzle-orm";

export const newWorkflowSchema = z.object({
  commandId: z.number(),
  workflowId: z.number().optional(),
  workflow: workflowSchema,
});

export const workflows = privateProcedure
  .meta({
    openapi: {
      method: "POST",
      path: "/workflows",
      tags: ["Workflows"],
      description: "Create or update workflow for user.",
    },
  })
  .input(newWorkflowSchema)
  .output(createSelectSchema(workflowTable))
  .mutation(async ({ input: { commandId, workflow } }) => {
    const data = {
      commandId,
      name: workflow.name,
      slug: kebabCase(workflow.name),
      url: workflow.url,
      inputs: workflow.inputs,
      outputs: workflow.outputs,
    };
    if (workflow.id) {
      const [updatedWorkflow] = await db.update(workflowTable).set(data).where(eq(workflowTable.id, workflow.id)).returning();
      return updatedWorkflow;
    } else {
      const [newWorkflow] = await db.insert(workflowTable).values(data).returning();
      return newWorkflow;
    }
  });
