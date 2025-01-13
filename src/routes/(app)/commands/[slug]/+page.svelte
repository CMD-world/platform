<script lang="ts">
  import Modal from "$components/Modal.svelte";
  import WorkflowForm from "$forms/WorkflowForm.svelte";

  // Props
  const { data } = $props();
  const { command, workflows } = $derived(data);
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
  <p class="p mt-4">Add workflows as needed to enhance the behaviour of your AI Agent.</p>
{:else}
  <p class="p mt-4">No workflows found. Go ahead and create one to get started.</p>
{/if}

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

{#if workflows && workflows.length > 0}
  <div class="mt-6 flex flex-wrap gap-6">
    {#each workflows as workflow}
      <a href="/commands/{command.slug}/{workflow.slug}" class="card bg-base-200 p-6 transition-all hover:scale-105 hover:bg-base-300">
        <h3 class="text-lg font-semibold">{workflow.name}</h3>

        <div class="mt-2 flex justify-between gap-4">
          <div class="flex-1">
            <div class="mb-1 text-sm font-medium">Inputs</div>
            <div class="mt-2 flex flex-wrap gap-2">
              {#each workflow.inputs as input}
                <span class="badge badge-primary whitespace-nowrap text-xs">{input.name}: {input.type}</span>
              {/each}
            </div>
          </div>

          <div class="flex-1">
            <div class="mb-1 text-sm font-medium">Outputs</div>
            <div class="mt-2 flex flex-wrap gap-2">
              {#each workflow.outputs as output}
                <span class="badge badge-primary whitespace-nowrap text-xs">{output.name}: {output.type}</span>
              {/each}
            </div>
          </div>
        </div>
      </a>
    {/each}
  </div>
{/if}
