import { z } from "zod";

export const types = ["string", "boolean", "number"];

const parameterSchema = z.object({
  name: z.string().min(1, { message: "Parameter name can't be empty" }),
  type: z.enum(["string", "boolean", "number"]),
});

export const workflowSchema = z.object({
  url: z.string().url({ message: "Invalid URL" }),
  inputs: z.array(parameterSchema).default([]),
  outputs: z.array(parameterSchema).default([]),
});
