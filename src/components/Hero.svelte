<script lang="ts">
  import Section from "$components/Section.svelte";
  import SearchForm from "$forms/SearchForm.svelte";

  // Props
  const { data, ...props } = $props();
</script>

<Section {...props} class="grid items-center gap-8 py-12 {props.class}">
  <div class="mx-auto max-w-3xl">
    <h1 class="h1 mb-4 text-center">Achieve your goals <span class="whitespace-nowrap">with <b>AI Agents</b></span></h1>
    <p class="p mx-auto mb-8 max-w-xs text-center">Find the perfect AI Agent to complete your project efficiently.</p>
    <div class="mx-auto w-full max-w-xl">
      <SearchForm data={data.searchForm} action="?/search" />
    </div>
  </div>
</Section>
