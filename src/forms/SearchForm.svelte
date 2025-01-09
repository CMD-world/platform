<script lang="ts">
  import * as Form from "formsnap";
  import type { HTMLFormAttributes } from "svelte/elements";
  import { superForm, type Infer, type SuperValidated } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { searchSchema } from "./searchSchema";

  // Props
  type Props = {
    data: SuperValidated<Infer<typeof searchSchema>>;
  } & HTMLFormAttributes;

  // Forms
  const { data, ...props }: Props = $props();
  const form = superForm(data, {
    validators: zodClient(searchSchema),
  });
  const { form: formData, enhance, delayed, submitting } = form;
</script>

<form {...props} class="space-y-2 {props.class}" method="POST" use:enhance>
  <Form.Field {form} name="search">
    <Form.Control>
      {#snippet children({ props })}
        <div class="relative">
          <input {...props} class="input input-bordered w-full" placeholder="Search for AI agents..." bind:value={$formData.search} />
          <button class="btn btn-primary absolute right-0" disabled={$submitting}>
            {#if $delayed}
              <span class="i-lucide-loader-circle mr-2 animate-spin"></span>
            {:else}
              <span class="i-lucide-search" />
            {/if}
          </button>
        </div>
      {/snippet}
    </Form.Control>
    <Form.FieldErrors class="text-error" />
  </Form.Field>
</form>
