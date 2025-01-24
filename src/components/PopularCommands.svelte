<script lang="ts">
  import Section from "$components/Section.svelte";
  import { type Command } from "$lib/schema";

  // Props
  type Props = {
    commands: Command[];
    class?: string;
  };

  // Props
  const { commands, ...props }: Props = $props();
</script>

{#snippet service(title: string, description: string)}
  <div class="cursor-pointer rounded-xl border p-6 duration-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-primary/5">
    <div>
      <h3 class="mb-2 text-2xl font-semibold">{title}</h3>
      <p class="text text-lg">{description}</p>
      <figure><img class="mt-4 rounded-xl" src="https://placehold.co/800x600/png?text={title}" alt={title} /></figure>
    </div>
  </div>
{/snippet}

<Section {...props} class={props.class}>
  <div class="mb-4 flex items-center justify-between">
    <h2 class="h2">Popular commands</h2>
    <button class="link-primary font-semibold underline">Explore all commands</button>
  </div>

  {#if commands && commands.length > 0}
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {#each commands as command}
        {@render service(command.name, command.description)}
      {/each}
    </div>
  {:else}
    <p class="p">No commands found.</p>
  {/if}
</Section>
