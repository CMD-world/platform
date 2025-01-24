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

<Section {...props} class={props.class}>
  <div class="mb-4 flex items-center justify-between">
    <h2 class="h2">Popular commands</h2>
    <button class="link-primary font-semibold underline">Explore all commands</button>
  </div>

  {#if commands && commands.length > 0}
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {#each commands as command}
        <a
          class="rounded-xl border p-6 duration-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-primary/5"
          href={`/${command.id}`}
        >
          <div>
            <h3 class="mb-2 text-2xl font-semibold">{command.name}</h3>
            <p class="text line-clamp-2 text-lg">{command.description}</p>
            <figure><img class="mt-4 rounded-xl" src="https://placehold.co/800x600/png?text={command.name}" alt={command.name} /></figure>
          </div>
        </a>
      {/each}
    </div>
  {:else}
    <p class="p">No commands found.</p>
  {/if}
</Section>
