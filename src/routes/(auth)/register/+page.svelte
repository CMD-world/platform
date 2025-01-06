<script lang="ts">
  import Logo from "$components/Logo.svelte";
  import OAuth from "$components/OAuth.svelte";
  import AuthForm from "$forms/AuthForm.svelte";

  // Props
  const { data } = $props();
  const { google, github } = $derived(data);
</script>

<svelte:head>
  <title>Register - AI Agent</title>
</svelte:head>

<div class="flex h-screen items-center justify-center px-4">
  <div class="max-w-md flex-grow">
    <Logo class="mx-auto mb-6 max-w-48" />

    <div class="rounded-md border p-8 dark:border-slate-600">
      <h1 class="h3 mb-2">Register</h1>

      <OAuth {google} {github} />

      <AuthForm name="Register" data={data.registerForm} action="?/register" />
    </div>

    <p class="text mt-4 text-center">
      Already have an account? <a class="link !underline" href="/login">Login</a>
    </p>
  </div>
</div>
