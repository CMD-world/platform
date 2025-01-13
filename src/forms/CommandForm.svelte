<script lang="ts">
  import * as Form from "formsnap";
  import type { HTMLFormAttributes } from "svelte/elements";
  import { superForm, type Infer, type SuperValidated } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { commandSchema } from "./commandSchema";

  // Props
  type Props = {
    data: SuperValidated<Infer<typeof commandSchema>>;
  } & HTMLFormAttributes;

  // Forms
  const { data, ...props }: Props = $props();
  const form = superForm(data, {
    validators: zodClient(commandSchema),
  });
  const { form: formData, enhance, delayed, submitting } = form;
</script>

<form {...props} class="space-y-2 {props.class}" method="POST" use:enhance>
  <Form.Field {form} name="name">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label class="label">Name</Form.Label>
        <input {...props} class="input input-bordered w-full" bind:value={$formData.name} type="text" />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors class="text-error" />
  </Form.Field>

  <button class="btn btn-primary w-full" disabled={$submitting}>
    {#if $delayed}
      <span class="i-lucide-loader-circle mr-2 animate-spin"></span>
    {/if}
    Create Command
  </button>
</form>
