<script lang="ts">
  import { page } from "$app/stores";
  import { type User } from "$lib/schema";
  import Logo from "$components/Logo.svelte";

  // Props
  const {
    user,
  }: {
    user: User | null;
  } = $props();

  // State
  let open = $state(false);
  $effect(() => {
    if ($page.url) open = false;
  });
</script>

{#snippet link(text: string, href: string)}
  <a class="link" {href}>{text}</a>
{/snippet}

{#snippet menu()}
  {@render link("Blog", "/blog")}

  {#if user}
    <a class="btn btn-primary" href="/logout" data-sveltekit-reload>Logout</a>
  {:else}
    <a class="btn btn-primary" href="/login">Login</a>
  {/if}
{/snippet}

<nav class="container flex items-center justify-between py-4">
  <Logo />

  <div class="hidden items-center gap-6 md:flex">
    {@render menu()}
  </div>

  <div class="md:hidden">
    <div class="drawer drawer-end">
      <input id="nav-drawer" type="checkbox" class="drawer-toggle" bind:checked={open} />
      <div class="drawer-content">
        <label for="nav-drawer" class="cursor-pointer">
          <span class="i-lucide-menu h-6 w-6"></span>
        </label>
      </div>

      <div class="drawer-side z-10">
        <label for="nav-drawer" aria-label="Close sidebar" class="drawer-overlay"></label>
        <div class="menu min-h-full w-80 bg-white p-4">
          <div class="mb-4">
            <Logo />
          </div>
          <div class="grid gap-6 pt-2 text-lg">
            {@render menu()}
          </div>
        </div>
      </div>
    </div>
  </div>
</nav>
