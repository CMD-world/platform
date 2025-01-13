<script lang="ts">
  import Hero from "$components/Hero.svelte";
  import PopularServices from "$components/PopularServices.svelte";
  import TopAgents from "$components/TopAgents.svelte";

  // Props
  const { data } = $props();
</script>

<svelte:head>
  <title>AI Agent</title>
</svelte:head>

<Hero {data} />
<PopularServices />
<TopAgents class="mt-16" />
