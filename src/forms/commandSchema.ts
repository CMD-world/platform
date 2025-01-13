import { z } from "zod";

export const commandSchema = z.object({
  name: z.string().min(1, { message: "Name can't be empty" }),
});
