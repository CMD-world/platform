# Themes

If you want to change theme, open `tailwind.config.js` and modify this section:

```ts
daisyui: {
  themes: ["cmyk", "night"],
}
```

Then set the theme you want to use in `src/app.html`:

```html
<html lang="en" data-theme="cmyk">
```

This project uses daisyUI, which supports 20+ themes. To see a list of themes, go to [daisyUI Themes](https://daisyui.com/docs/themes/).

## Dark mode

If the `dark:` class isn't working properly, make sure that the `data-theme` in `src/app.html` matches this section in `tailwind.config.js`:

```ts
darkMode: ["class", '[data-theme="night"]'],
```
