<script lang="ts">
  import Modal from "$components/Modal.svelte";
  import WorkflowForm from "$forms/WorkflowForm.svelte";
  import PromptForm from "$forms/PromptForm.svelte";
  import Workflow from "./Workflow.svelte";
  import { trpc } from "$lib/trpc/client";
  import { getContext } from "svelte";

  // Props
  const { data } = $props();
  const { command, workflows } = $derived(data);

  // Helpers
  let deletingWorkflow = $state(false);
  async function deleteWorkflow(workflowId: number) {
    deletingWorkflow = true;
    await trpc().workflows.delete.mutate({ id: workflowId });
    window.location.reload();
  }
</script>

<svelte:head>
  <title>{command.name} - AI Agent</title>
</svelte:head>

<div class="flex items-center gap-2">
  <a href="/commands" class="flex items-center text-gray-500 hover:text-gray-700" aria-label="Go back">
    <span class="i-lucide-arrow-left size-6"></span>
  </a>
  <h1 class="h2">{command.name}</h1>
</div>

{#if workflows && workflows.length > 0}
  <PromptForm data={data.promptForm} action="?/prompt" />
{:else}
  <p class="p mt-4">No workflows found. Go ahead and create one to get started.</p>
{/if}

{#if workflows && workflows.length > 0}
  <h1 class="h2 mt-6">Workflows</h1>

  <div class="mt-4 flex flex-wrap gap-6">
    {#each workflows as workflow}
      <Modal>
        {#snippet trigger()}
          <Workflow {workflow} />
        {/snippet}
        <div class="mb-4 flex items-center gap-4">
          <h3 class="h3">Update Workflow</h3>
          <button class="btn btn-error" onclick={() => deleteWorkflow(workflow.id)} disabled={deletingWorkflow}>
            <span class="i-lucide-trash-2"></span>
            Delete
          </button>
        </div>
        <WorkflowForm {workflow} data={data.workflowForm} action="?/workflow" />
      </Modal>
    {/each}
  </div>
{/if}

<Modal>
  {#snippet trigger()}
    <button class="btn btn-primary mt-4">
      <span class="i-lucide-plus"></span>
      Create Workflow
    </button>
  {/snippet}
  <h3 class="h3 mb-4">Create Workflow</h3>
  <WorkflowForm onclose={() => console.log("hey")} data={data.workflowForm} action="?/workflow" />
</Modal>
