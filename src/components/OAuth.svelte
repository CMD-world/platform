<script lang="ts">
  // Props
  const { google, github } = $props();
</script>

{#if google}
  <a class="btn my-2 w-full" href="/google">
    <img src="/google.svg" width="16" height="16" alt="Google" />
    Continue with Google
  </a>
{/if}

{#if github}
  <a class="btn my-2 w-full" href="/github">
    <img src="/github.svg" width="16" height="16" alt="GitHub" />
    Continue with GitHub
  </a>
{/if}

{#if google || github}
  <div class="my-2 grid w-full grid-cols-[1fr_auto_1fr] items-center gap-4">
    <hr class="dark:border-slate-600" />
    <span class="text">OR</span>
    <hr class="dark:border-slate-600" />
  </div>
{/if}
