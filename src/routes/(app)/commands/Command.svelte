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

<a
  href="/commands/{command.slug}"
  class="rounded-xl border p-6 duration-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-primary/5"
>
  <div class="flex flex-col gap-2">
    <h3 class="text-lg font-semibold dark:text-white">{command.name}</h3>
    <div class="text-sm opacity-70 dark:text-gray-300">{workflows} workflows</div>
  </div>
</a>
