<script lang="ts">
  import Modal from "$components/Modal.svelte";
  import CommandForm from "$forms/CommandForm.svelte";
  import Command from "./Command.svelte";

  // Props
  const { data } = $props();
  const { commands } = $derived(data);
</script>

<svelte:head>
  <title>Commands - AI Agent</title>
</svelte:head>

<h1 class="h2">Commands</h1>

{#if commands && commands.length == 0}
  <p class="p mt-4">No commands found. Go ahead and create one.</p>
{/if}

{#if commands && commands.length > 0}
  <div class="mt-6 flex flex-wrap gap-6">
    {#each commands as { command, workflows }}
      <Command {command} {workflows} />
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
  {#snippet content()}
    <h3 class="h3 mb-4">Create Command</h3>
    <CommandForm data={data.commandForm} action="?/command" />
  {/snippet}
</Modal>
