<script lang="ts">
  import { hooks } from "svelte-preprocess-react";
  import { usePrivy } from "@privy-io/react-auth";
  import PrivyLogin from "$components/PrivyLogin.svelte";

  // Props
  const { data } = $props();
  const { command } = $derived(data);

  // Privy
  const privy = hooks(() => usePrivy());
</script>

<svelte:head>
  <title>{command.name} - CMD.world</title>
</svelte:head>

<h1 class="h2">{command.name}</h1>

<p class="p mb-4 mt-4">{command.description}</p>

{#if $privy}
  {@const { ready, authenticated } = $privy}
  {#if ready}
    {#if authenticated}
      <a class="btn btn-primary" href="/{command.id}/message">
        <span class="i-lucide-send"></span>
        Send Message
      </a>
    {:else}
      <PrivyLogin />
    {/if}
  {:else}
    <button class="btn btn-primary" disabled>
      <span class="i-lucide-send"></span>
      Send Message
    </button>
  {/if}
{/if}
