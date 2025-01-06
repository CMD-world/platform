<script lang="ts">
  // Props
  const { ...props } = $props();
</script>

<a {...props} href="/" aria-label="Logo" class="block max-w-40 {props.class}">
  <enhanced:img src="/static/logo-dark.png?w=320" alt="Logo" class="hidden [[data-theme=dark]_&]:block" />
  <enhanced:img src="/static/logo-light.png?w=320" alt="Logo" class="block [[data-theme=dark]_&]:hidden" />
</a>
