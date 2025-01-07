import type { Actions, PageServerLoad } from "./$types";
import { requestSchema } from "$forms/requestSchema";
import { zod } from "sveltekit-superforms/adapters";
import { fail, superValidate } from "sveltekit-superforms";
import { openai } from "$lib/openai";

export const load: PageServerLoad = async () => {
  // Initialize form
  return {
    requestForm: await superValidate(zod(requestSchema), { errors: false }),
  };
};

export const actions: Actions = {
  request: async ({ request }) => {
    // Validate form
    const requestForm = await superValidate(request, zod(requestSchema));
    if (!requestForm.valid) return fail(400, { requestForm });
    const { message } = requestForm.data;

    // Get response from LLM
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });
    const output = response.choices.length > 0 ? response.choices[0].message.content : null;
    console.log(output);
  },
};
