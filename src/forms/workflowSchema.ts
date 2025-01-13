import { z } from "zod";

const parameterSchema = z.object({
  name: z.string().min(1, { message: "Name can't be empty" }),
  type: z.enum(["string", "boolean", "number"]),
});

export const workflowSchema = z.object({
  name: z.string().min(1, { message: "Name can't be empty" }),
  url: z.string().url({ message: "Invalid URL" }),
  inputs: z
    .array(parameterSchema)
    .min(1, { message: "At least one input parameter is required" })
    .default([{ name: "", type: "string" }]),
  outputs: z
    .array(parameterSchema)
    .min(1, { message: "At least one output parameter is required" })
    .default([{ name: "", type: "string" }]),
});

// Types
export type Parameter = {
  name: string;
  type: "string" | "boolean" | "number";
};
export const types = ["string", "boolean", "number"];
