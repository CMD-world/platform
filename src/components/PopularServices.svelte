<script lang="ts">
  import Section from "$components/Section.svelte";

  // Props
  const { ...props } = $props();
</script>

{#snippet service(title: string, description: string)}
  <div class="rounded-xl bg-gray-50 p-4">
    <div>
      <h3 class="mb-2 text-2xl font-semibold">{title}</h3>
      <p class="p">{description}</p>
      <figure><img class="mt-4 rounded-xl" src="https://placehold.co/800x600/png?text={title}" alt={title} /></figure>
    </div>
  </div>
{/snippet}

<Section {...props} class={props.class}>
  <div class="mb-4 flex items-center justify-between">
    <h2 class="h2">Popular services</h2>
    <a href="#" class="link-primary font-semibold underline">Explore all services</a>
  </div>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    {@render service("3D Industrial Design", "Professional 3D modeling and industrial design services for product innovation.")}
    {@render service("Website Development", "Custom website development solutions tailored for business performance.")}
    {@render service("Email Marketing", "Strategic email marketing campaigns designed to maximize engagement.")}
  </div>
</Section>
