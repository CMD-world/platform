<script lang="ts">
  import Hero from "$components/Hero.svelte";
  import PopularServices from "$components/PopularServices.svelte";
  import TopAgents from "$components/TopAgents.svelte";
</script>

<svelte:head>
  <title>AI Agent</title>
</svelte:head>

<Hero />
<PopularServices class="mb-16" />
<TopAgents />
