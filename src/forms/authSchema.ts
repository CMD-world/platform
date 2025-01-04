import z from "zod";

export const authSchema = z.object({
  email: z.string().email({ message: "E-mail must be valid" }),
  password: z.string().min(8, { message: "Password must be minimum 8 characters" }),
});
