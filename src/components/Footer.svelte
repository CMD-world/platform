<script lang="ts">
  import Logo from "$components/Logo.svelte";

  // Props
  const { ...props } = $props();
</script>

<footer {...props} class="border-t py-12 dark:border-slate-600 {props.class}">
  <div class="container">
    <div class="grid gap-8 md:grid-cols-4">
      <div>
        <Logo class="mb-3 max-w-24" />
        <p class="text">We build minimum viable products in record speed for startups.</p>
      </div>

      <div>
        <h3 class="mb-4 text-lg font-bold">Links</h3>
        <ul class="space-y-2">
          <li><a href="/" class="link">Home</a></li>
          <li><a href="/#pricing" class="link">Pricing</a></li>
          <li><a href="/#reviews" class="link">Reviews</a></li>
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

      <div>
        <h3 class="mb-4 text-lg font-bold">Contact Us</h3>
        <div class="space-y-2">
          <a class="link" href="mailto:mvp@svelterust.com"><span class="i-lucide-mail mr-1"></span> mvp@svelterust.com</a>
        </div>
      </div>
    </div>

    <div class="mt-12 text-center">
      <p class="text">© {new Date().getFullYear()} MVP. All rights reserved.</p>
    </div>
  </div>
</footer>
