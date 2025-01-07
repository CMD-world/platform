<script lang="ts">
  import RequestForm from "$forms/RequestForm.svelte";

  // Props
  const { data } = $props();
</script>

<svelte:head>
  <title>Dashboard - AI Agent</title>
</svelte:head>

<div class="mb-4 flex items-center gap-4">
  <h1 class="h2">Dashboard</h1>
  <a class="btn btn-error" href="/logout" data-sveltekit-reload>Logout</a>
</div>

<p class="p">This is the dashboard page. It's where you can see your workflows, create new ones, and manage your account.</p>

<RequestForm class="mt-4" data={data.requestForm} action="?/request" />
