import { writeFile } from "fs/promises";

// Get args from command line
const args = process.argv.slice(2);
const [name, ...formFields] = args;

if (!name || formFields.length < 1) {
  console.log("Usage:");
  console.log("  form <name> <field>:<type>");
} else {
  // Create shadcn-svelte form
  await form(name, formFields);
}

function titleCase(input) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

function renderInput({ field, type }, name) {
  if (type == "textarea") {
    return `<textarea {...attrs} rows={4} class="textarea textarea-bordered w-full" bind:value={$formData.${field}}></textarea>`;
  } else if (type == "files") {
    return `<input {...attrs} type="file" multiple class="input input-bordered w-full" bind:value={$formData.${field}} />`;
  } else if (type == "select") {
    return `<select {...attrs} class="select select-bordered w-full" bind:value={$formData.${field}}>
      <option disabled selected>Choose an option</option>
      <option value="First">First</option>
      <option value="Second">Second</option>
      <option value="Third">Third</option>
    </select>`;
  } else {
    return `<input {...attrs} class="input input-bordered w-full" bind:value={$formData.${field}} type="${type}" />`;
  }
}

function renderField({ field, type }, name) {
  return `  <Form.Field {form} name="${field}">
    <Form.Control let:attrs>
      <Form.Label class="label">${titleCase(field)}</Form.Label>
      ${renderInput({ field, type }, name)}
    </Form.Control>
    <Form.FieldErrors class="text-error" />
  </Form.Field>`;
}

function renderFormType(renderedFields) {
  if (renderedFields.includes(`file`)) {
    return ` enctype="multipart/form-data"`;
  } else {
    return "";
  }
}

function renderSchemaField({ field, type }) {
  if (type == "email") {
    return `  ${field}: z.string().email(),`;
  } else if (type == "password") {
    return `  ${field}: z.string().min(8, { message: "Password must be minimum 8 characters" }),`;
  } else if (type == "number") {
    return `  ${field}: z.number(),`;
  } else if (type == "file") {
    return `  ${field}: z.instanceof(File),`;
  } else if (type == "files") {
    return `  ${field}: z.array(z.instanceof(File)),`;
  } else if (type == "date") {
    return `  ${field}: z.date(),`;
  } else if (type == "url") {
    return `  ${field}: z.string().url(),`;
  } else {
    return `  ${field}: z.string().min(1, { message: "${titleCase(field)} can't be empty"}),`;
  }
}

async function form(name, args) {
  // Parse fields
  const fields = args.map((arg) => {
    const [field, type] = arg.split(":");
    return { field, type };
  });

  // Generate +page.svelte
  const title = titleCase(name);
  const renderedFields = fields.map((field) => renderField(field, name)).join("\n\n");
  const schemaName = `${name}Schema`;
  const form = `<script lang="ts">
  import * as Form from "formsnap";
  import type { HTMLFormAttributes } from "svelte/elements";
  import { superForm, type Infer, type SuperValidated } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { ${schemaName} } from "./${schemaName}";

  // Props
  type Props = {
    data: SuperValidated<Infer<typeof ${schemaName}>>;
    name: string;
  } & HTMLFormAttributes;

  // Forms
  const { data, ...props }: Props = $props();
  const form = superForm(data, {
    validators: zodClient(${schemaName}),
  });
  const { form: formData, enhance, delayed, submitting } = form;
</script>

<form {...props} class="space-y-2 {props.class}" method="POST"${renderFormType(renderedFields)} use:enhance>
${renderedFields}

  <input type="hidden" name="id" bind:value={$formData.id} />
  <button class="btn btn-primary w-full" disabled={$submitting}>
    {#if $delayed}
      <span class="i-lucide-loader-circle animate-spin mr-2"></span>
    {/if}
    Submit
  </button>
</form>`;

  // Generate schema file
  const renderedSchemaFields = fields.map(renderSchemaField).join("\n").trimEnd();
  const schema = `import { z } from "zod";

export const ${schemaName} = z.object({
  id: z.number().optional(),
${renderedSchemaFields}
});`;

  const pageServer = `import type { Actions, PageServerLoad } from "./$types";
import { ${schemaName} } from "$forms/${schemaName}";
import { zod } from "sveltekit-superforms/adapters";
import { fail, superValidate } from "sveltekit-superforms";

export const load: PageServerLoad = async () => {
  // Initialize form
  return {
    ${name}Form: await superValidate(zod(${schemaName}), { errors: false }),
  };
};

export const actions: Actions = {
  ${name}: async ({ request }) => {
    // Validate form
    const ${name}Form = await superValidate(request, zod(${schemaName}));
    if (!${name}Form.valid) return fail(400, { ${name}Form });
    const { ${fields
      .filter((field) => field != "id")
      .map(({ field }) => field)
      .join(", ")} } = ${name}Form.data;
    console.log(${fields
      .filter((field) => field != "id")
      .map(({ field }) => field)
      .join(", ")});
  },
};`;

  // Generate +page.svelte
  const pageSvelte = `<script lang="ts">
    import ${title}Form from "$forms/${title}Form.svelte";

    // Props
    const { data } = $props();
</script>

<${title}Form data={data.${name}Form} action="?/${name}" />`;

  // Create files
  const formPath = `src/forms/${title}Form.svelte`;
  const schemaPath = `src/forms/${schemaName}.ts`;
  await Promise.all([writeFile(formPath, form), writeFile(schemaPath, schema)]);
  console.log(`\x1b[4mForm has been created! Create +page.svelte with following:\x1b[0m\n\n\x1b[1m${pageSvelte}\x1b[0m\n`);
  console.log(`\x1b[4mIn the same directory, put following in +page.server.ts:\x1b[0m\n\n\x1b[1m${pageServer}\x1b[0m`);
}
