<script lang="ts">
  import type { Workflow } from "$lib/schema";

  // Props
  const {
    workflow,
  }: {
    workflow: Workflow;
  } = $props();
</script>

<div class="card max-w-72 cursor-pointer bg-base-200 p-6 transition-all hover:bg-base-300 dark:bg-gray-800 dark:hover:bg-gray-700">
  <h3 class="text-lg font-semibold dark:text-white">{workflow.name}</h3>

  <div class="mt-2">
    <p class="line-clamp-2 text-left text-sm text-base-content/70 dark:text-gray-300">{workflow.description}</p>
    <div class="flex-1">
      <div class="mt-2 flex flex-wrap gap-2">
        {#each workflow.inputs as input}
          <span class="badge badge-primary whitespace-nowrap text-xs">{input.name}: {input.type}</span>
        {/each}
      </div>
    </div>
  </div>
</div>
