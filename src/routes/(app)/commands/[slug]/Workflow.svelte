<script lang="ts">
  import type { Workflow } from "$lib/schema";

  // Props
  const {
    workflow,
  }: {
    workflow: Workflow;
  } = $props();
</script>

<div class="max-w-72 cursor-pointer rounded-xl border p-6 duration-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-primary/5">
  <h3 class="text-lg font-semibold dark:text-white">{workflow.name}</h3>

  {#if workflow.description || workflow.inputs.length > 0}
    <div class="mt-2">
      <p class="line-clamp-2 text-left text-sm opacity-70 dark:text-gray-300">{workflow.description}</p>
      <div class="mt-4 flex flex-wrap gap-2">
        {#each workflow.inputs as input}
          <span class="badge badge-primary whitespace-nowrap text-xs">{input.name}:{input.type}</span>
        {/each}
      </div>
    </div>
  {/if}
</div>
