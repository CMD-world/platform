<script lang="ts">
  // Props
  const { highlight = false, children, ...props } = $props();
</script>

<section {...props} class="relative left-[50%] right-[50%] -mx-[50vw] w-[100vw] {highlight ? 'bg-gray-100' : ''}">
  <div class="container {props.class}">
    {@render children()}
  </div>
</section>
