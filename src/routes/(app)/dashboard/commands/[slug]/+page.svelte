<script lang="ts">
  // Props
  const { data } = $props();
  const { command } = $derived(data);
</script>

<svelte:head>
  <title>{command.name} - AI Agent</title>
</svelte:head>

<a class="link-primary font-semibold underline" href="/dashboard">Go back</a>

<h1 class="h2 mt-2">{command.name}</h1>

<p class="p mt-4">
  Let's get started creating some commands for our AI agent. Go to n8n and <a
    class="link-primary underline"
    href="https://n8n.46.101.167.207.sslip.io"
    target="_blank">create your workflow</a
  >, then add it below here:
</p>
