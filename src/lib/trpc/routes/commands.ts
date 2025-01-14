import { z } from "zod";
import { kebabCase } from "change-case";
import { t } from "$lib/trpc/t";
import { db } from "$lib/database";
import { commandTable } from "$lib/schema";
import { commandSchema } from "$forms/commandSchema";
import { privateProcedure } from "$lib/trpc/context";
import { createSelectSchema } from "drizzle-zod";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const commands = t.router({
  create: privateProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/commands/create",
        tags: ["Commmands"],
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
        method: "PUT",
        path: "/commands/update",
        tags: ["Commmands"],
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
        method: "DELETE",
        path: "/commands/delete",
        tags: ["Commands"],
        description: "Delete a command for user.",
      },
    })
    .input(commandSchema.pick({ id: true }))
    .output(
      z.object({
        success: z.boolean(),
      }),
    )
    .mutation(async ({ ctx: { user }, input: { id } }) => {
      if (!id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Command ID is required for deletion",
        });
      }

      await db.delete(commandTable).where(and(eq(commandTable.id, id), eq(commandTable.userId, user.id)));
      return { success: true };
    }),
});
