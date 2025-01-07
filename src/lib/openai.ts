import OpenAI from "openai";
import { observeOpenAI } from "langfuse";
import { env } from "$env/dynamic/private";

// Create client
export const openai = observeOpenAI(
  new OpenAI({
    apiKey: env.OPENAI_API_KEY,
  }),
);
