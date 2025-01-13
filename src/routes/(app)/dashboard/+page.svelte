<script lang="ts">
  import Modal from "$components/Modal.svelte";
  import PrivyLogout from "$components/PrivyLogout.svelte";
  import CommandForm from "$forms/CommandForm.svelte";

  // Props
  const { data } = $props();
</script>

<svelte:head>
  <title>Dashboard - AI Agent</title>
</svelte:head>

<div class="flex items-center gap-4">
  <h1 class="h2">Dashboard</h1>
  <PrivyLogout />
</div>

<p class="p mt-4">Welcome to your AI Agent dashboard. Here you can manage your commands and workflows.</p>

<h2 class="h3 mt-8">Commands</h2>

<p class="p mt-4">Get started building your own AI Agents with commands.</p>

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
