<script lang="ts">
  // Props
  const {
    author = "John Smith",
    review = "This product exceeded my expectations! The quality and performance are outstanding. I'm thoroughly impressed with every aspect.",
    image = "",
    ...props
  } = $props();
</script>

<div {...props} class="mx-auto max-w-lg py-12 {props.class}">
  <p class="mb-4 text-lg">{review}</p>
  <div class="flex items-center gap-2">
    {#if image}
      <div class="avatar">
        <div class="w-12 rounded-full">
          <img src={image} alt={author} />
        </div>
      </div>
    {:else}
      <div class="avatar placeholder">
        <div class="w-12 rounded-full bg-slate-100">
          <span class="text-xl">{author[0].toUpperCase()}</span>
        </div>
      </div>
    {/if}
    <p class="font-semibold">{author}</p>
  </div>
</div>
