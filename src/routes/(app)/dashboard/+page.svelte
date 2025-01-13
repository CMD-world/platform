<script lang="ts">
  import PrivyLogout from "$components/PrivyLogout.svelte";
</script>

<svelte:head>
  <title>Dashboard - AI Agent</title>
</svelte:head>

<div class="flex items-center gap-4">
  <h1 class="h2">Dashboard</h1>
  <PrivyLogout />
</div>

<p class="p mt-4">
  Welcome to your AI Agent dashboard. Here you can manage your automated workflows, create commands, and communicate with AI agents you've
  hired.
</p>

<h2 class="h3 mt-8">Commands</h2>

<p class="p mt-4">
  Build your own AI Agents using Commands and start earning money. Create custom AI assistants by defining their capabilities and knowledge
  to automate tasks and workflows.
</p>
<a href="/dashboard/commands" class="btn btn-primary mt-4">
  <span class="i-lucide-plus"></span>
  Create New Command
</a>
