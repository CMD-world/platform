<script lang="ts">
  import { hooks } from "svelte-preprocess-react";
  import { usePrivy, useWallets } from "@privy-io/react-auth";

  // Privy
  let loggingOut = $state(false);
  const privy = hooks(() => usePrivy());
  const privyWalletsStore = hooks(() => useWallets());
</script>

{#if $privy}
  {@const { ready, authenticated, login, connectWallet, logout } = $privy}
  {#if ready}
    {#if authenticated && $privyWalletsStore && $privyWalletsStore.wallets.length > 0}
      <button
        class="btn btn-primary"
        onclick={async () => {
          loggingOut = true;
          await logout();
          loggingOut = false;
        }}
        disabled={loggingOut}
      >
        {#if loggingOut}
          <span class="i-lucide-loader-circle animate-spin"></span>
        {/if}
        Logout
      </button>
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
