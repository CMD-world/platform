<script lang="ts">
  import { page } from "$app/state";
</script>

<h1 class="h2">Something went wrong</h1>
<p class="p mt-4">{page.error?.message}</p>
