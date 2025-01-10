import { router } from "$lib/trpc/router";
import { generateOpenApiDocument } from "trpc-to-openapi";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }) => {
  return {
    spec: generateOpenApiDocument(router, {
      title: "AI Agent",
      version: "0.1.0",
      description: "Documentation for AI Agent.",
      baseUrl: `${url.origin}/api`,
    }),
  };
};
