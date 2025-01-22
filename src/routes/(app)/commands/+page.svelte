<script lang="ts">
  import Modal from "$components/Modal.svelte";
  import CommandForm from "$forms/CommandForm.svelte";
  import Command from "./Command.svelte";
  import Create from "./Create.svelte";

  // Props
  const { data } = $props();
  const { commands } = $derived(data);
</script>

<svelte:head>
  <title>Commands - CMD.world</title>
</svelte:head>

<h1 class="h2">Commands</h1>

{#if commands && commands.length == 0}
  <p class="p mt-4">No commands found. Go ahead and create one.</p>
{/if}

<div class="mt-4 flex flex-wrap gap-4">
  {#if commands && commands.length > 0}
    {#each commands as { command, workflows }}
      <Command {command} {workflows} />
    {/each}
  {/if}

  <Modal>
    {#snippet trigger()}
      <Create />
    {/snippet}
    {#snippet content()}
      <h3 class="h3 mb-4">Create Command</h3>
      <CommandForm data={data.commandForm} action="?/command" />
    {/snippet}
  </Modal>
</div>
