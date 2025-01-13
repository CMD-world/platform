<script lang="ts">
  import Modal from "$components/Modal.svelte";
  import WorkflowForm from "$forms/WorkflowForm.svelte";

  // Props
  const { data } = $props();
  const { command } = $derived(data);
</script>

<svelte:head>
  <title>{command.name} - AI Agent</title>
</svelte:head>

<div class="flex items-center gap-2">
  <a href="/commands" class="flex items-center text-gray-500 hover:text-gray-700">
    <span class="i-lucide-arrow-left size-6"></span>
  </a>
  <h1 class="h2">{command.name}</h1>
</div>

<p class="p mt-4">You don't have any workflows yet. Go ahead and create one to get started.</p>

<Modal>
  {#snippet trigger()}
    <button class="btn btn-primary mt-4">
      <span class="i-lucide-plus"></span>
      Create Workflow
    </button>
  {/snippet}
  <h3 class="h3 mb-4">Create Workflow</h3>
  <WorkflowForm data={data.workflowForm} action="?/workflow" />
</Modal>
