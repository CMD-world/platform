import daisyui from "daisyui";
import tailwindcssTypography from "@tailwindcss/typography";
import { iconsPlugin, getIconCollections } from "@egoist/tailwindcss-icons";

// Brand colors
const primary = "#0F172A";
const primaryContent = "#FFFFFF";

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
    },
  },
  daisyui: {
    logs: false,
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["cmyk"],
          primary,
          "primary-content": primaryContent,
        },
      },
    ],
  },
  plugins: [
    daisyui,
    tailwindcssTypography,
    iconsPlugin({
      collections: getIconCollections(["lucide"]),
    }),
  ],
};

export default config;
