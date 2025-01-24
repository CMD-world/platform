<script lang="ts">
  import Hero from "$components/Hero.svelte";
  import PopularCommands from "$components/PopularCommands.svelte";

  // Props
  const { data } = $props();
</script>

<svelte:head>
  <title>CMD.world</title>
</svelte:head>

<Hero {data} />
<PopularCommands class="my-4" commands={data.commands} />
