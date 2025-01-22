<script lang="ts">
  import Logo from "$components/Logo.svelte";

  // Props
  const { ...props } = $props();
</script>

<footer {...props} class="border-t py-12 dark:border-slate-600 {props.class}">
  <div class="container">
    <div class="grid gap-8 md:grid-cols-4">
      <div class="md:col-span-2">
        <Logo class="mb-6" />
        <p class="text max-w-xs">Create powerful AI agents in minutes using our visual workflow builder.</p>
      </div>

      <div>
        <h3 class="mb-4 text-lg font-bold">Links</h3>
        <ul class="space-y-2">
          <li><a href="/" class="link">Home</a></li>
          <li><a href="/blog" class="link">Blog</a></li>
        </ul>
      </div>

      <div>
        <h3 class="mb-4 text-lg font-bold">Legal</h3>
        <ul class="space-y-2">
          <li><a href="/terms-of-service" class="link">Terms of Service</a></li>
          <li><a href="/privacy-policy" class="link">Privacy Policy</a></li>
        </ul>
      </div>
    </div>

    <div class="mt-12 text-center">
      <p class="text">© {new Date().getFullYear()} CMD.world. All rights reserved.</p>
    </div>
  </div>
</footer>
