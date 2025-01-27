<script lang="ts">
  import "../../app.css";
  import Header from "$components/Header.svelte";
  import Footer from "$components/Footer.svelte";
  import PrivyProvider from "$components/PrivyProvider.svelte";
  import { Toaster } from "svelte-french-toast";

  // Props
  const { children } = $props();
</script>

<Toaster />
<PrivyProvider>
  <div class="flex min-h-screen flex-col">
    <Header />

    <main class="container mt-4 flex-grow pb-16">
      {@render children()}
    </main>

    <Footer />
  </div>
</PrivyProvider>
