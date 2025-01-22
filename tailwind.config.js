import daisyui from "daisyui";
import tailwindcssTypography from "@tailwindcss/typography";
import { iconsPlugin, getIconCollections } from "@egoist/tailwindcss-icons";

// Brand colors
const primary = "#FFFFFF";
const primaryContent = "#000000";

// /** @type {import('tailwindcss').Config} */
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
        dark: {
          ...require("daisyui/src/theming/themes")["night"],
          primary,
          "primary-content": primaryContent,
          "base-100": "#171717",
          "base-200": "#0D0D0D",
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
