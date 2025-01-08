import OpenAI from "openai";
import { observeOpenAI } from "langfuse";
import { env } from "$env/dynamic/private";

// Create client
export const openai = observeOpenAI(
  new OpenAI({
    apiKey: env.OPENAI_API_KEY,
  }),
  {
    clientInitParams: {
      baseUrl: env.LANGFUSE_HOST,
      publicKey: env.LANGFUSE_PUBLIC_KEY,
      secretKey: env.LANGFUSE_SECRET_KEY,
    },
  },
);
