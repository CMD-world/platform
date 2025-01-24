<script lang="ts">
  // Props
  const { data } = $props();
  const { command } = $derived(data);
</script>

<svelte:head>
  <title>{command.name} - CMD.world</title>
</svelte:head>

<h1 class="h2">{command.name}</h1>

<p class="p mt-4">{command.description}</p>

<a class="btn btn-primary mt-4" href="/{command.id}/message">
  <span class="i-lucide-send"></span>
  Send Message
</a>
