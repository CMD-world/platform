# Form

The `form` utility helps you make forms that check for errors both in the browser and on the server.
To use it, run `bun form`. Give it a name and list the fields you want, like this: `<name>:<type>`.
The name is what you'll call the field, and type is what kind of input it is (like `text`, `textarea`, or `select`).

Here's how to make a form for a car that takes name, description and image:

```sh
bun form car name:text description:textarea image:file
```

When you run this, you'll need to copy over some code and create `+page.svelte` and `+page.server.ts`.
After you do that, you'll have a working form that checks for errors and can be used anywhere on your site.
