<script lang="ts">
  // Props
  const { ...props } = $props();
</script>

<a {...props} href="/" aria-label="Logo" class="block max-w-48 {props.class}">
  <enhanced:img src="/static/logo-dark.png?w=384" alt="Logo" class="hidden [[data-theme=dark]_&]:block" />
  <enhanced:img src="/static/logo-light.png?w=384" alt="Logo" class="block [[data-theme=dark]_&]:hidden" />
</a>
