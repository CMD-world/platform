<script lang="ts">
  import { goto } from "$app/navigation";
  import { hooks } from "svelte-preprocess-react";
  import { usePrivy } from "@privy-io/react-auth";

  // Privy
  let loggingOut = $state(false);
  const privy = hooks(() => usePrivy());
</script>

{#if $privy}
  {@const { authenticated, logout } = $privy}
  <button
    class="btn"
    onclick={async () => {
      loggingOut = true;
      await logout();
      await goto("/");
      loggingOut = false;
    }}
    disabled={loggingOut || !authenticated}
  >
    {#if loggingOut}
      <span class="i-lucide-loader-circle animate-spin"></span>
    {/if}
    Logout
  </button>
{:else}
  <button class="btn btn-primary" disabled>Logout</button>
{/if}
