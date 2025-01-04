<script lang="ts">
  import Header from "$components/Header.svelte";
  import Footer from "$components/Footer.svelte";

  // Props
  const { data, children } = $props();
  const { user } = $derived(data);
</script>

<Header {user} />

<main class="container mt-4 pb-16">
  {@render children()}
</main>

<Footer />
