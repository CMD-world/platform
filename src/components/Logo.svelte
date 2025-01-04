<script lang="ts">
  // Props
  const { ...props } = $props();
</script>

<a {...props} href="/" aria-label="Logo" class="block max-w-32 {props.class}">
  <enhanced:img src="/static/logo.png?w=256" alt="Logo" />
</a>
