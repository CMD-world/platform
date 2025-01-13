<script lang="ts">
  import Modal from "$components/Modal.svelte";
  import CommandForm from "$forms/CommandForm.svelte";

  // Props
  const { data } = $props();
  const { commands } = $derived(data);
</script>

<svelte:head>
  <title>Commands - AI Agent</title>
</svelte:head>

<h1 class="h2">Commands</h1>

{#if commands && commands.length == 0}
  <p class="p mt-4">No commands found. Go ahead and create a command which will contain multiple workflows.</p>
{/if}

{#if commands && commands.length > 0}
  <div class="mt-6 flex flex-wrap gap-6">
    {#each commands as { command, workflows }}
      <a href="/commands/{command.slug}" class="card min-w-[240px] bg-base-200 p-6 transition-all hover:scale-105 hover:bg-base-300">
        <div class="flex flex-col gap-2">
          <h3 class="text-lg font-semibold">{command.name}</h3>
          <div class="text-sm opacity-70">{workflows} workflows</div>
        </div>
      </a>
    {/each}
  </div>
{/if}

<Modal>
  {#snippet trigger()}
    <button class="btn btn-primary mt-4">
      <span class="i-lucide-plus"></span>
      Create Command
    </button>
  {/snippet}
  <h3 class="h3 mb-4">Create Command</h3>
  <CommandForm data={data.commandForm} action="?/command" />
</Modal>
