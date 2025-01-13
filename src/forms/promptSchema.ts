import { z } from "zod";

export const promptSchema = z.object({
  prompt: z.string().min(1, { message: "Prompt can't be empty"}),
});