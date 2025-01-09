<script lang="ts">
  // Props
  const { data } = $props();
  const { query } = $derived(data);
</script>

<h1 class="h2">AI Agents</h1>

{#if query && query.length > 0}
  <p class="p mt-4">Didn't find any AI Agents for query: "<span class="font-bold">{query}</span>".</p>
{:else}
  <p class="p mt-4">Didn't find any AI Agents for your query.</p>
{/if}
