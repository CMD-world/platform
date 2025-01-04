<script lang="ts">
  import * as Form from "formsnap";
  import type { HTMLFormAttributes } from "svelte/elements";
  import { superForm, type Infer, type SuperValidated } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { authSchema } from "./authSchema";

  // Props
  type Props = {
    data: SuperValidated<Infer<typeof authSchema>>;
    name: string;
  } & HTMLFormAttributes;

  // Forms
  const { data, name, ...props }: Props = $props();
  const form = superForm(data, {
    validators: zodClient(authSchema),
  });
  const { form: formData, enhance, delayed, submitting } = form;
</script>

<form class="space-y-2" method="POST" use:enhance {...props}>
  <Form.Field {form} name="email">
    <Form.Control let:attrs>
      <Form.Label class="label">Email</Form.Label>
      <input {...attrs} class="input input-bordered w-full" bind:value={$formData.email} autocomplete="email" type="email" />
    </Form.Control>
    <Form.FieldErrors class="text-error" />
  </Form.Field>

  <Form.Field {form} name="password">
    <Form.Control let:attrs>
      <Form.Label class="label">Password</Form.Label>
      <input {...attrs} class="input input-bordered w-full" bind:value={$formData.password} type="password" />
    </Form.Control>
    <Form.FieldErrors class="text-error" />
  </Form.Field>

  <button class="btn btn-primary w-full" disabled={$submitting}>
    {#if $delayed}
      <span class="i-lucide-loader-circle animate-spin"></span>
    {/if}
    {name}
  </button>
</form>
