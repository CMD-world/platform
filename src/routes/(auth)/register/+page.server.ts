import type { Actions, PageServerLoad } from "./$types";
import { zod } from "sveltekit-superforms/adapters";
import { fail, setError, superValidate } from "sveltekit-superforms";
import { login, register } from "$lib/auth";
import { redirect } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import { authSchema } from "$forms/authSchema";

export const load: PageServerLoad = async () => {
  // Initialize form
  return {
    registerForm: await superValidate(zod(authSchema)),
    google: env.GOOGLE_CLIENT_ID != undefined && env.GOOGLE_CLIENT_SECRET != undefined,
    github: env.GITHUB_CLIENT_ID != undefined && env.GITHUB_CLIENT_SECRET != undefined,
  };
};

export const actions: Actions = {
  register: async ({ request, cookies }) => {
    // Validate form
    const registerForm = await superValidate(request, zod(authSchema));
    if (!registerForm.valid) return fail(400, { registerForm });
    const { email, password } = registerForm.data;

    // Register then login user
    try {
      await register(email, { password });
      await login(email, { password }, cookies);
    } catch (error) {
      console.log(error);
      return setError(registerForm, "password", "Account already exists, try another method");
    }
    redirect(303, "/");
  },
};
