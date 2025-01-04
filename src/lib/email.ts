import { Resend } from "resend";
import { env } from "$env/dynamic/private";

// Create Resend client
export const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;
