import { z } from "zod";

export const workflowSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Name can't be empty" }),
  url: z.string().url({ message: "Invalid URL" }),
  description: z.string().default(""),
  inputs: z
    .array(
      z.object({
        name: z.string().regex(/^[a-z0-9_]+$/, { message: "Input must be lowercase with only letters, numbers and underscores" }),
        type: z.enum(["string", "boolean", "number"]),
      }),
    )
    .default([{ name: "", type: "string" }]),
});

// Types
export type Parameter = {
  name: string;
  type: "string" | "boolean" | "number";
};
export const types = ["string", "boolean", "number"];
