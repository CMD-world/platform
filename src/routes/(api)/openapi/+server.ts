import { json } from "@sveltejs/kit";
import { router } from "$lib/trpc/router";
import { generateOpenApiDocument } from "trpc-to-openapi";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url: { origin } }) => {
  const openApiDocument = generateOpenApiDocument(router, {
    title: "cmd.world.sdk",
    version: "0.1.0",
    baseUrl: `${origin}/api`,
  });
  return json(openApiDocument);
};
