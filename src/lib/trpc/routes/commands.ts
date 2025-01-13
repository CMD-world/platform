import { kebabCase } from "change-case";
import { db } from "$lib/database";
import { commandTable } from "$lib/schema";
import { createSelectSchema } from "drizzle-zod";
import { commandSchema } from "$forms/commandSchema";
import { privateProcedure } from "$lib/trpc/context";

export const commands = privateProcedure
  .meta({
    openapi: {
      method: "POST",
      path: "/commands",
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
  });
