import { z } from "zod";

export const commandSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Name can't be empty" }),
  description: z.string().default(""),
});
