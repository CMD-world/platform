import { z } from "zod";

export const workflowSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Name can't be empty" }),
  url: z.string().url({ message: "Invalid URL" }),
  description: z.string().min(1, { message: "Description can't be empty" }),
  inputs: z
    .array(
      z.object({
        name: z.string().regex(/^[a-z0-9_]+$/, { message: "Input must be lowercase with only letters, numbers and underscores" }),
        type: z.enum(["string", "boolean", "number"]),
      }),
    )
    .min(1, { message: "At least one input parameter is required" })
    .default([{ name: "", type: "string" }]),
});

// Types
export type Parameter = {
  name: string;
  type: "string" | "boolean" | "number";
};
export const types = ["string", "boolean", "number"];
