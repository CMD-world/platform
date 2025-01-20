<script lang="ts">
  import Modal from "$components/Modal.svelte";
  import WorkflowForm from "$forms/WorkflowForm.svelte";
  import Workflow from "./Workflow.svelte";
  import Create from "../Create.svelte";
  import { trpc } from "$lib/trpc/client";
  import { invalidateAll } from "$app/navigation";

  // Props
  const { data } = $props();
  const { command, workflows } = $derived(data);

  // Helpers
  let deletingWorkflow = $state(false);
  async function deleteWorkflow(workflowId: number, modal: HTMLDialogElement) {
    try {
      deletingWorkflow = true;
      await trpc().workflows.delete.mutate({ id: workflowId });
      modal.close();
      await invalidateAll();
    } finally {
      deletingWorkflow = false;
    }
  }
</script>

<svelte:head>
  <title>{command.name} - AI Agent</title>
</svelte:head>

<div class="flex items-center gap-4">
  <a href="/commands" class="flex items-center text-gray-500 hover:text-gray-700" aria-label="Go back">
    <span class="i-lucide-arrow-left size-6"></span>
  </a>
  <h1 class="h2">{command.name}</h1>
</div>

{#if !workflows || workflows.length === 0}
  <p class="p mt-4">No workflows found. Go ahead and create one to get started.</p>
{/if}

<div class="mt-4 flex flex-wrap gap-4">
  {#if workflows && workflows.length > 0}
    {#each workflows as workflow}
      <Modal>
        {#snippet trigger()}
          <Workflow {workflow} />
        {/snippet}
        {#snippet content(modal: HTMLDialogElement)}
          <div class="mb-4 flex items-baseline gap-4">
            <h3 class="h3">Update Workflow</h3>
            <button class="btn btn-error" onclick={() => deleteWorkflow(workflow.id, modal)} disabled={deletingWorkflow}>
              <span class="i-lucide-trash-2"></span>
              Delete
            </button>
          </div>
          <WorkflowForm {workflow} data={data.workflowForm} action="?/workflow" />
        {/snippet}
      </Modal>
    {/each}
  {/if}

  <Modal>
    {#snippet trigger()}
      <Create />
    {/snippet}
    {#snippet content()}
      <h3 class="h3 mb-4">Create Workflow</h3>
      <WorkflowForm data={data.workflowForm} action="?/workflow" />
    {/snippet}
  </Modal>
</div>

<div class="mt-4">
  <button class="btn btn-primary">
    <span class="i-lucide-send"></span>
    Send Message
  </button>
</div>
