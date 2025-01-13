<script lang="ts">
  // Props
  const { data } = $props();
  const { command } = $derived(data);
</script>

<svelte:head>
  <title>{command.name} - AI Agent</title>
</svelte:head>

<h1 class="h2">{command.name}</h1>

<p class="p mt-4">Go ahead and add one or multiple workflows to your command and specify inputs/outputs.</p>
