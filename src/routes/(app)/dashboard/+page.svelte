<script lang="ts">
  import { trpc } from "$lib/trpc/client";
  import PrivyLogout from "$components/PrivyLogout.svelte";

  // State
  let copied = $state(false);
  let disabled = $state(false);
  let apiKey = $state<string | undefined>();

  // API Key
  async function generateApiKey() {
    disabled = true;
    const response = await trpc().keys.mutate();
    apiKey = response.apiKey;
    disabled = false;
  }
</script>

<svelte:head>
  <title>Dashboard - AI Agent</title>
</svelte:head>

<div class="flex items-center gap-4">
  <h1 class="h2">Dashboard</h1>
  <PrivyLogout />
</div>

<p class="p mt-4">This is the dashboard page. It's where you can see your workflows, create new ones, and manage your account.</p>

<h2 class="h2 mt-8">API Key</h2>

<button class="btn btn-primary mt-4" onclick={generateApiKey} {disabled}> Generate API Key </button>

{#if apiKey}
  <p class="p mt-4">
    Use this API Key to authenticate with the API by passing it as an Authorization header in your requests (Bearer token).
  </p>
  <div class="mt-4 rounded-lg bg-base-200 p-4">
    <div class="flex items-center justify-between">
      <p class="font-mono text-sm">{apiKey}</p>
      <button
        class="btn btn-ghost btn-sm"
        onclick={() => {
          if (apiKey) {
            navigator.clipboard.writeText(apiKey);
            copied = true;
            setTimeout(() => (copied = false), 3000);
          }
        }}
      >
        {#if copied}
          Copied! <span class="i-lucide-check"></span>
        {:else}
          Copy
        {/if}
      </button>
    </div>
  </div>
{/if}
