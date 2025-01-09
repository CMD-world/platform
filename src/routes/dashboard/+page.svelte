<script lang="ts">
  import PrivyLogout from "$components/PrivyLogout.svelte";

  // State
  let copied = $state(false);
  let apiKey = $state<string | undefined>();
  let loading = $state(false);
  let loadingVisible = $state(false);

  // API Key
  async function generateApiKey() {
    loading = true;
    const loadingTimer = setTimeout(() => {
      loadingVisible = true;
    }, 500);

    try {
      const response = await fetch("/api/keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expiresAt: null,
        }),
      });
      const data = await response.json();
      apiKey = data.apiKey;
    } catch (error) {
      console.error("Error fetching keys:", error);
    }
    clearTimeout(loadingTimer);
    loading = false;
    loadingVisible = false;
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

<button class="btn btn-primary mt-4" onclick={generateApiKey} disabled={loading}>
  {#if loadingVisible}
    <span class="i-lucide-loader-circle animate-spin"></span>
  {/if}
  Generate API Key
</button>

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
