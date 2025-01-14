<script lang="ts">
  import type { Workflow } from "$lib/schema";

  // Props
  const {
    workflow,
  }: {
    workflow: Workflow;
  } = $props();
</script>

<div class="card cursor-pointer bg-base-200 p-6 transition-all hover:scale-105 hover:bg-base-300">
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
</div>
