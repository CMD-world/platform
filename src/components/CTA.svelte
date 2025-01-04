<script lang="ts">
  import Section from "$components/Section.svelte";

  // Props
  const { ...props } = $props();
</script>

<Section {...props} class="py-12 text-center {props.class}">
  <h2 class="h2">Ready to build your MVP?</h2>
  <p class="p mt-4">Start your business today and transform your idea into reality!</p>
  <a class="btn btn-primary mt-6 w-full md:btn-lg md:w-auto" href="/checkout">Get MVP</a>
</Section>
