<script lang="ts">
  import type { Command } from "$lib/schema";

  // Props
  const {
    command,
    workflows,
  }: {
    command: Command;
    workflows: number;
  } = $props();
</script>

<a href="/commands/{command.slug}" class="card bg-base-200 p-6 transition-all hover:bg-base-300 dark:bg-gray-800 dark:hover:bg-gray-700">
  <div class="flex flex-col gap-2">
    <h3 class="text-lg font-semibold dark:text-white">{command.name}</h3>
    <div class="text-sm opacity-70 dark:text-gray-300">{workflows} workflows</div>
  </div>
</a>
