<script lang="ts">
  import Section from "$components/Section.svelte";

  // Props
  const { ...props } = $props();
</script>

<Section {...props} class="grid items-center gap-8 py-12 text-center md:grid-cols-2 md:text-start {props.class}">
  <div>
    <h1 class="h1 mb-4">Build your MVP in days, not weeks</h1>
    <p class="p mb-4">
      The SvelteKit boilerplate with all you need to build your SaaS, AI tool, or any other web app and get your first sale online.
    </p>
    <a class="btn btn-primary w-full md:btn-lg md:w-auto" href="/checkout">Get MVP</a>
  </div>

  <img class="rounded-lg md:block" src="https://placehold.co/1200x900?text=MVP&font=roboto" width="1200" height="900" alt="Placeholder" />
</Section>
