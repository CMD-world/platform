import { z } from "zod";
import { kebabCase } from "change-case";
import { t } from "$lib/trpc/t";
import { db } from "$lib/database";
import { workflowTable, commandTable } from "$lib/schema";
import { workflowSchema } from "$forms/workflowSchema";
import { privateProcedure } from "$lib/trpc/context";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const workflows = t.router({
  create: privateProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/workflows.create",
        tags: ["Workflows"],
        description: "Create a new workflow for user.",
      },
    })
    .input(
      z.object({
        commandId: z.number(),
        workflow: workflowSchema,
      }),
    )
    .output(workflowSchema)
    .mutation(async ({ ctx: { user }, input: { commandId, workflow } }) => {
      const [command] = await db
        .select()
        .from(commandTable)
        .where(and(eq(commandTable.id, commandId), eq(commandTable.userId, user.id)));

      if (!command) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Command not found or doesn't belong to user",
        });
      }

      const [newWorkflow] = await db
        .insert(workflowTable)
        .values({
          commandId,
          name: workflow.name,
          slug: kebabCase(workflow.name),
          url: workflow.url,
          inputs: workflow.inputs,
          description: workflow.description,
        })
        .returning();
      return newWorkflow;
    }),

  update: privateProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/workflows.update",
        tags: ["Workflows"],
        description: "Update an existing workflow for user.",
      },
    })
    .input(workflowSchema)
    .output(workflowSchema)
    .mutation(async ({ ctx: { user }, input: workflow }) => {
      if (!workflow.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Workflow ID is required for updates",
        });
      }

      const [existingWorkflow] = await db
        .select()
        .from(workflowTable)
        .innerJoin(commandTable, eq(workflowTable.commandId, commandTable.id))
        .where(and(eq(workflowTable.id, workflow.id), eq(commandTable.userId, user.id)));

      if (!existingWorkflow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workflow not found or doesn't belong to user",
        });
      }

      const [updatedWorkflow] = await db
        .update(workflowTable)
        .set({
          name: workflow.name,
          slug: kebabCase(workflow.name),
          url: workflow.url,
          inputs: workflow.inputs,
          description: workflow.description,
        })
        .where(eq(workflowTable.id, workflow.id))
        .returning();
      return updatedWorkflow;
    }),

  delete: privateProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/workflows.delete",
        tags: ["Workflows"],
        description: "Delete an existing workflow.",
      },
    })
    .input(workflowSchema.pick({ id: true }))
    .output(z.object({ deleted: z.boolean() }))
    .mutation(async ({ ctx: { user }, input: { id } }) => {
      if (!id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Workflow ID is required for deletion",
        });
      }

      const [existingWorkflow] = await db
        .select()
        .from(workflowTable)
        .innerJoin(commandTable, eq(workflowTable.commandId, commandTable.id))
        .where(and(eq(workflowTable.id, id), eq(commandTable.userId, user.id)));

      if (!existingWorkflow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workflow not found or doesn't belong to user",
        });
      }

      const workflows = await db.delete(workflowTable).where(eq(workflowTable.id, id)).returning();
      return { deleted: workflows.length > 0 };
    }),

  test: privateProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/workflows.test",
        tags: ["Workflows"],
        description: "Test workflow connection with mock data",
      },
    })
    .input(workflowSchema.pick({ url: true, inputs: true }))
    .output(z.boolean())
    .query(async ({ input: { url, inputs } }) => {
      // Generate mock data
      const data = Object.fromEntries(
        inputs.map(({ name, type }) => {
          let value;
          if (type == "string") {
            value = Math.random().toString(36).substring(2, 7);
          } else if (type == "boolean") {
            value = Math.random() > 0.5;
          } else if (type == "number") {
            value = Math.floor(Math.random() * 100) + 1;
          }
          return [name, value];
        }),
      );
      console.log("Sending data:", data);

      // Send to endpoint
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return response.ok || response.status == 500; // We just want to see that endpoint exists, not that it works
    }),
});
