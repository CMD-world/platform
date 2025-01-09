import type { PageServerLoad } from "./$types";
import { searchSchema } from "$forms/searchSchema";
import { zod } from "sveltekit-superforms/adapters";
import { superValidate } from "sveltekit-superforms";

export const load: PageServerLoad = async () => {
  // Initialize form
  return {
    searchForm: await superValidate(zod(searchSchema)),
  };
};
