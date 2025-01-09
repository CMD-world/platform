<script lang="ts">
  import { page } from "$app/state";
  import Logo from "$components/Logo.svelte";
  import PrivyLogin from "$components/PrivyLogin.svelte";

  // State
  let open = $state(false);
  $effect(() => {
    if (page.url) open = false;
  });
</script>

{#snippet link(text: string, href: string)}
  <a class="link" {href}>{text}</a>
{/snippet}

{#snippet menu()}
  {@render link("Pricing", "/#pricing")}
  {@render link("Blog", "/blog")}

  <PrivyLogin />
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
