# Icons

To use icons, use the span tag and specify icon in the class:

```svelte
<span class="i-lucide-home"></span>
```

This project includes [Lucide](https://lucide.dev/) icons by default.

## Add icon packs

If you want to add other icon packs like `mdi`, install it with `bun i -D @iconify-json/mdi` then modify `tailwind.config.js`:

```js
plugins: [
  daisyui,
  tailwindcssTypography,
  iconsPlugin({
    collections: getIconCollections(["lucide", "mdi"]),
  }),
],
```

Now you can use the `mdi` icons like this:

```svelte
<span class="i-mdi-abacus"></span>
```

For more documentation about icons, see [@egoist/tailwindcss-icons](https://github.com/egoist/tailwindcss-icons).
