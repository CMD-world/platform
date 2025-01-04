import { mdsvex } from "mdsvex";
import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".md"],
  preprocess: [
    mdsvex({
      extensions: [".md"],
      layout: {
        _: "./src/components/Article.svelte",
      },
    }),
    vitePreprocess(),
  ],
  vitePlugin: {
    inspector: {
      toggleKeyCombo: "shift-meta",
    },
  },
  kit: {
    csrf: false,
    adapter: adapter(),
    alias: {
      $forms: "./src/forms/*",
      $components: "./src/components/*",
    },
  },
};

export default config;
