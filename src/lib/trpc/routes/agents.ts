import { z } from "zod";
import { t } from "$lib/trpc/t";

export const agents = t.procedure
  .meta({
    openapi: {
      method: "POST",
      path: "/agents",
      tags: ["Agents"],
      description: "Create new agent for user.",
    },
  })
  .input(
    z.object({
      name: z.string(),
      description: z.string(),
    }),
  )
  .output(
    z.object({
      name: z.string(),
      description: z.string(),
    }),
  )
  .mutation(async ({ input }) => {
    return input;
  });
