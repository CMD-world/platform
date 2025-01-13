import { z } from "zod";

export const workflowSchema = z.object({
  url: z.string().url({ message: "Invalid URL" }),
});
