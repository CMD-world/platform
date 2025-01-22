<script lang="ts">
  import * as Form from "formsnap";
  import type { HTMLFormAttributes } from "svelte/elements";
  import { superForm, type Infer, type SuperValidated } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { types, workflowSchema } from "./workflowSchema";
  import { getContext } from "svelte";
  import type { Workflow } from "$lib/schema";

  // Props
  type Props = {
    workflow?: Workflow;
    data: SuperValidated<Infer<typeof workflowSchema>>;
  } & HTMLFormAttributes;

  // State
  const modal = getContext<{ close: () => void }>("modal");

  // Forms
  const { workflow, data, ...props }: Props = $props();
  const form = superForm(data, {
    dataType: "json",
    validators: zodClient(workflowSchema),
    resetForm: workflow ? false : true,
    id: workflow ? `update_${workflow.id}` : "create",
    onResult: ({ result }) => {
      if (result.type == "success") modal.close();
    },
  });
  const { form: formData, enhance, delayed, submitting } = form;

  // If workflow is passed/updated, initialize data with that
  $effect(() => {
    if (workflow) $formData = workflow;
  });

  // Helper functions
  const addInput = () => ($formData.inputs = [...$formData.inputs, { name: "", type: "string" }]);
  const removeInput = (index: number) => ($formData.inputs = $formData.inputs.filter((_, i) => i !== index));
  const addOutput = () => ($formData.outputs = [...$formData.outputs, { name: "", type: "string" }]);
  const removeOutput = (index: number) => ($formData.outputs = $formData.outputs.filter((_, i) => i !== index));
</script>

<form {...props} class="space-y-4 {props.class}" method="POST" use:enhance>
  <Form.Fieldset {form} name="name">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label class="label">Name</Form.Label>
        <input {...props} class="input input-bordered w-full" bind:value={$formData.name} type="text" />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors class="mt-2 text-error" />
  </Form.Fieldset>

  <Form.Fieldset {form} name="url">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label class="label">URL</Form.Label>
        <input {...props} class="input input-bordered w-full" bind:value={$formData.url} type="url" />
      {/snippet}
    </Form.Control>
    <Form.Description class="text mt-2"
      >Go here to <a class="link !underline" href="https://build.46.101.167.207.sslip.io" target="_blank">build workflow</a> and get webhook
      URL ></Form.Description
    >
    <Form.FieldErrors class="mt-2 text-error" />
  </Form.Fieldset>

  <Form.Fieldset {form} name="inputs">
    <Form.Legend class="mb-2">Inputs</Form.Legend>

    {#each $formData.inputs as _, i}
      <div class="mb-4 flex gap-2">
        <Form.Field {form} name="inputs[{i}].name">
          <Form.Control>
            {#snippet children({ props })}
              <input {...props} class="input input-bordered flex-1" bind:value={$formData.inputs[i].name} placeholder="Name" />
            {/snippet}
          </Form.Control>
        </Form.Field>

        <Form.Field {form} name="inputs[{i}].type">
          <Form.Control>
            {#snippet children({ props })}
              <select {...props} class="select select-bordered" bind:value={$formData.inputs[i].type}>
                {#each types as type}
                  <option value={type}>{type}</option>
                {/each}
              </select>
            {/snippet}
          </Form.Control>
        </Form.Field>

        <button type="button" class="btn btn-square btn-error" aria-label="Remove" onclick={() => removeInput(i)}>
          <span class="i-lucide-trash-2"></span>
        </button>
      </div>
    {/each}
    <button type="button" class="btn" onclick={addInput}><span class="i-lucide-plus"></span> Add Input </button>
    <Form.FieldErrors class="mt-2 text-error" />
  </Form.Fieldset>

  <Form.Fieldset {form} name="outputs">
    <Form.Legend class="mb-2">Outputs</Form.Legend>

    {#each $formData.outputs as _, i}
      <div class="mb-4 flex gap-2">
        <Form.Field {form} name="outputs[{i}].name">
          <Form.Control>
            {#snippet children({ props })}
              <input {...props} class="input input-bordered flex-1" bind:value={$formData.outputs[i].name} placeholder="Name" />
            {/snippet}
          </Form.Control>
        </Form.Field>

        <Form.Field {form} name="outputs[{i}].type">
          <Form.Control>
            {#snippet children({ props })}
              <select {...props} class="select select-bordered" bind:value={$formData.outputs[i].type}>
                {#each types as type}
                  <option value={type}>{type}</option>
                {/each}
              </select>
            {/snippet}
          </Form.Control>
        </Form.Field>

        <button type="button" class="btn btn-square btn-error" aria-label="Remove" onclick={() => removeOutput(i)}>
          <span class="i-lucide-trash-2"></span>
        </button>
      </div>
    {/each}
    <button type="button" class="btn" onclick={addOutput}><span class="i-lucide-plus"></span> Add Output </button>
    <Form.FieldErrors class="mt-2 text-error" />
  </Form.Fieldset>

  <button class="btn btn-primary w-full" disabled={$submitting}>
    {#if $delayed}
      <span class="i-lucide-loader-circle mr-2 animate-spin"></span>
    {/if}
    {#if workflow}
      Update Workflow
    {:else}
      Create Workflow
    {/if}
  </button>
</form>
