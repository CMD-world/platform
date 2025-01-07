import { z } from "zod";

export const requestSchema = z.object({
  id: z.number().optional(),
  message: z.string().min(1, { message: "Message can't be empty"}),
});