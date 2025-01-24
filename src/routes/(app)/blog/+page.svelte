<script lang="ts">
  // Props
  const { data } = $props();
  const { articles } = $derived(data);
</script>

<svelte:head>
  <title>Blog - CMD.world</title>
</svelte:head>

<h1 class="h2">Blog</h1>

<div class="mt-6 grid gap-8 md:grid-cols-2">
  {#each articles as article}
    <a href="/blog/{article.url}" class="duration-100 hover:scale-[102%]">
      <img src={article.image} alt={article.title} width="1600" height="900" class="aspect-video w-full rounded-lg" />
      <div class="mt-4">
        <h2 class="h3">{article.title}</h2>
        <p class="p mt-2">{article.description}</p>
        <p class="mt-2 text-lg text-gray-500">
          {article.date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>
    </a>
  {/each}
</div>
