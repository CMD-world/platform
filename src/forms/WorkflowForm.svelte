<script lang="ts">
  import * as Form from "formsnap";
  import type { HTMLFormAttributes } from "svelte/elements";
  import { superForm, type Infer, type SuperValidated } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { types, workflowSchema } from "./workflowSchema";
  import { getContext } from "svelte";
  import type { Workflow } from "$lib/schema";
  import { trpc } from "$lib/trpc/client";

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

  // Verify connection available when inputs are not empty
  const canVerify = $derived.by(() => {
    for (let input of $formData.inputs) {
      if (input.name.trim().length == 0) return false;
    }
    try {
      new URL($formData.url);
      return true;
    } catch {
      return false;
    }
  });

  let verifyingConnection = $state(false);
  let validConnection = $state<boolean | null>(null);
  const verifyMessage = $derived.by(() => {
    if (validConnection === true) {
      return "Valid";
    } else if (validConnection === false) {
      return "Invalid";
    } else {
      return "Verify";
    }
  });
  async function verifyConnection() {
    verifyingConnection = true;
    validConnection = await trpc().workflows.test.query({
      url: $formData.url,
      inputs: $formData.inputs,
    });
    verifyingConnection = false;
  }
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
        <div class="flex items-center gap-2">
          <input {...props} class="input input-bordered w-full" bind:value={$formData.url} type="url" />

          <div class="tooltip" data-tip={canVerify && !verifyingConnection ? verifyMessage : undefined}>
            <button
              type="button"
              class="btn btn-square btn-info"
              aria-label="Verify"
              onclick={verifyConnection}
              disabled={!canVerify || verifyingConnection}
            >
              <span class="i-lucide-refresh-cw" class:animate-spin={verifyingConnection}></span>
            </button>
          </div>
        </div>
      {/snippet}
    </Form.Control>
    <Form.Description class="text mt-2"
      ><a class="link !underline" href="https://build.46.101.167.207.sslip.io" target="_blank">Build workflow</a> then paste production webhook
      URL here</Form.Description
    >
    <Form.FieldErrors class="mt-2 text-error" />
  </Form.Fieldset>

  <Form.Fieldset {form} name="inputs">
    <Form.Legend class="mb-2">Inputs</Form.Legend>

    {#each $formData.inputs as _, i}
      <div class="mb-4 flex gap-2">
        <div class="flex w-full flex-col">
          <Form.Field {form} name="inputs[{i}].name">
            <Form.Control>
              {#snippet children({ props })}
                <input {...props} class="input input-bordered flex-grow" bind:value={$formData.inputs[i].name} placeholder="Name" />
              {/snippet}
            </Form.Control>
            <Form.FieldErrors class="mt-2 text-error" />
          </Form.Field>
        </div>

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

        <div class="tooltip" data-tip="Remove">
          <button type="button" class="btn btn-square btn-error" aria-label="Remove" onclick={() => removeInput(i)}>
            <span class="i-lucide-trash-2"></span>
          </button>
        </div>
      </div>
    {/each}
    <button type="button" class="btn btn-primary" onclick={addInput}><span class="i-lucide-plus"></span> Add Input </button>
    <Form.FieldErrors class="mt-2 text-error" />
  </Form.Fieldset>

  <Form.Fieldset {form} name="description">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label class="label">Description</Form.Label>
        <textarea {...props} class="textarea textarea-bordered w-full" bind:value={$formData.description} rows={4}></textarea>
      {/snippet}
    </Form.Control>
    <Form.Description class="text mt-2">Describe what the inputs should look like to the LLM</Form.Description>
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
