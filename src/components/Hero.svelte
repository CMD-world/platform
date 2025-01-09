<script lang="ts">
  import Section from "$components/Section.svelte";

  // Props
  const { ...props } = $props();
</script>

<Section {...props} class="grid items-center gap-8 py-12 text-center {props.class}">
  <div class="mx-auto max-w-3xl">
    <h1 class="h1 mb-4">Achieve your goals <span class="whitespace-nowrap">with <b>AI Agents</b></span></h1>
    <p class="p mx-auto mb-8 max-w-xs">Find the perfect AI Agent to complete your project efficiently.</p>
    <div class="form-control mx-auto w-full max-w-xl">
      <input class="input input-bordered w-full" placeholder="Search for AI agents..." />
    </div>
  </div>
</Section>
