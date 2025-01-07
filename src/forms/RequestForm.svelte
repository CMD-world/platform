<script lang="ts">
  import * as Form from "formsnap";
  import type { HTMLFormAttributes } from "svelte/elements";
  import { superForm, type Infer, type SuperValidated } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { requestSchema } from "./requestSchema";

  // Props
  type Props = {
    data: SuperValidated<Infer<typeof requestSchema>>;
  } & HTMLFormAttributes;

  // Forms
  const { data, ...props }: Props = $props();
  const form = superForm(data, {
    validators: zodClient(requestSchema),
  });
  const { form: formData, enhance, delayed, submitting } = form;
</script>

<form {...props} class="space-y-2 {props.class}" method="POST" use:enhance>
  <Form.Field {form} name="message">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label class="label">Message</Form.Label>
        <textarea {...props} rows={4} class="textarea textarea-bordered w-full" bind:value={$formData.message}></textarea>
      {/snippet}
    </Form.Control>
    <Form.FieldErrors class="text-error" />
  </Form.Field>

  <input type="hidden" name="id" bind:value={$formData.id} />
  <button class="btn btn-primary w-full" disabled={$submitting}>
    {#if $delayed}
      <span class="i-lucide-loader-circle mr-2 animate-spin"></span>
    {/if}
    Generate
  </button>
</form>
