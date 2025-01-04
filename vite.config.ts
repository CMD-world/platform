import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { enhancedImages } from "@sveltejs/enhanced-img";
import { sentrySvelteKit } from "@sentry/sveltekit";

export default defineConfig({
  plugins: [sentrySvelteKit(), enhancedImages(), sveltekit()],
});
