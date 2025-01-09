import type { Actions, PageServerLoad } from "./$types";
import { searchSchema } from "$forms/searchSchema";
import { zod } from "sveltekit-superforms/adapters";
import { fail, superValidate } from "sveltekit-superforms";

export const load: PageServerLoad = async () => {
  // Initialize form
  return {
    searchForm: await superValidate(zod(searchSchema), { errors: false }),
  };
};

export const actions: Actions = {
  search: async ({ request }) => {
    // Validate form
    const searchForm = await superValidate(request, zod(searchSchema));
    if (!searchForm.valid) return fail(400, { searchForm });
    const { query } = searchForm.data;
    console.log(query);
  },
};
