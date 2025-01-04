import type { Actions, PageServerLoad } from "./$types";
import { zod } from "sveltekit-superforms/adapters";
import { fail, setError, superValidate } from "sveltekit-superforms";
import { login } from "$lib/auth";
import { redirect } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import { authSchema } from "$forms/authSchema";

export const load: PageServerLoad = async () => {
  // Initialize form
  return {
    loginForm: await superValidate(zod(authSchema)),
    google: env.GOOGLE_CLIENT_ID != undefined && env.GOOGLE_CLIENT_SECRET != undefined,
    github: env.GITHUB_CLIENT_ID != undefined && env.GITHUB_CLIENT_SECRET != undefined,
  };
};

export const actions: Actions = {
  login: async ({ request, cookies }) => {
    // Validate form
    const loginForm = await superValidate(request, zod(authSchema));
    if (!loginForm.valid) return fail(400, { loginForm });
    const { email, password } = loginForm.data;

    // Login user
    try {
      await login(email, { password }, cookies);
    } catch (error) {
      return setError(loginForm, "password", "Invalid email/password or login method");
    }
    redirect(303, "/");
  },
};
