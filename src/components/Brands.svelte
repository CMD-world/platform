<script lang="ts">
  import Section from "$components/Section.svelte";

  // Props
  const { ...props } = $props();
</script>

{#snippet brand(name: string)}
  <img class="rounded-lg" src="https://placehold.co/200x75?text={name}&font=roboto" width="200" height="75" alt={name} />
{/snippet}

<Section {...props} class="flex flex-wrap justify-center gap-4 py-12 {props.class}">
  {@render brand("OpenAI")}
  {@render brand("Anthropic")}
  {@render brand("Fireworks")}
  {@render brand("Groq")}
</Section>
