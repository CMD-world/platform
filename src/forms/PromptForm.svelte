<script lang="ts">
  import * as Form from "formsnap";
  import type { HTMLFormAttributes } from "svelte/elements";
  import { superForm, type Infer, type SuperValidated } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { promptSchema } from "./promptSchema";

  // Props
  type Props = {
    data: SuperValidated<Infer<typeof promptSchema>>;
  } & HTMLFormAttributes;

  // State
  let output = $state<string | undefined>();

  // Forms
  const { data, ...props }: Props = $props();
  const form = superForm(data, {
    validators: zodClient(promptSchema),
    onResult: ({ result }) => {
      if (result.type == "success") {
        output = result.data?.message;
      }
    },
  });
  const { form: formData, enhance, delayed, submitting } = form;
</script>

<form {...props} class="max-w-screen-sm space-y-2 {props.class}" method="POST" use:enhance>
  <Form.Field {form} name="prompt">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label class="label">Prompt</Form.Label>
        <textarea {...props} rows={4} class="textarea textarea-bordered w-full" bind:value={$formData.prompt}></textarea>
      {/snippet}
    </Form.Control>
    <Form.FieldErrors class="text-error" />
  </Form.Field>

  <button class="btn btn-primary" disabled={$submitting}>
    {#if $delayed}
      <span class="i-lucide-loader-circle mr-2 animate-spin"></span>
    {:else}
      <span class="i-lucide-send"></span>
    {/if}
    Send message
  </button>
</form>

{#if output}
  <div class="mt-4 rounded-lg bg-base-200 p-4">
    <div class="prose prose-neutral max-w-none">
      {@html output}
    </div>
  </div>
{/if}
