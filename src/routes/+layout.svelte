<script lang="ts">
  import "../app.css";
  import PrivyProvider from "$components/PrivyProvider.svelte";

  // Props
  const { children } = $props();
</script>

<PrivyProvider>
  {@render children()}
</PrivyProvider>
