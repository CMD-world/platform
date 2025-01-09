<script lang="ts">
  import { hooks } from "svelte-preprocess-react";
  import { usePrivy } from "@privy-io/react-auth";

  // Privy
  const privy = hooks(() => usePrivy());
</script>

{#if $privy}
  {@const { ready, authenticated, login, connectWallet } = $privy}
  {#if ready}
    {#if authenticated}
      <a class="btn btn-primary" href="/dashboard">Dashboard</a>
    {:else}
      <button
        class="btn btn-primary"
        onclick={() => {
          if (!authenticated) {
            login();
          } else {
            connectWallet();
          }
        }}
      >
        Login
      </button>
    {/if}
  {:else}
    <button class="btn btn-primary" disabled>Login</button>
  {/if}
{/if}
