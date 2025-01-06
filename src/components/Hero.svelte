<script lang="ts">
  import Section from "$components/Section.svelte";

  // Props
  const { ...props } = $props();
</script>

<Section {...props} class="grid items-center gap-8 py-12 text-center md:grid-cols-2 md:text-start {props.class}">
  <div>
    <h1 class="h1 mb-4">Build AI Agent in <br />3 Simple Steps 🚀</h1>
    <p class="p mb-4">
      Create powerful AI agents in minutes using our visual workflow builder. Design, test, and deploy custom AI assistants for any task.
    </p>
    <a class="btn btn-primary w-full md:btn-lg md:w-auto" href="/register">Build AI Agent</a>
  </div>

  <img class="rounded-lg md:block" src="https://placehold.co/1200x900?text=AI Agent&font=roboto" width="1200" height="900" alt="AI Agent" />
</Section>
