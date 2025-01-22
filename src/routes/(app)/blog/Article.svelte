<script lang="ts">
  import { type Snippet } from "svelte";

  // Props
  const {
    title,
    description,
    date,
    image,
    children,
  }: {
    title: string;
    description: string;
    date?: string;
    image?: string;
    children: Snippet;
  } = $props();
</script>

<svelte:head>
  <title>{title} - CMD.world</title>
  <meta name="description" content={description} />
  <link href="/one-dark.css" rel="stylesheet" />
</svelte:head>

<article
  class="prose mx-auto max-w-none md:prose-xl prose-headings:mb-4 prose-headings:font-semibold prose-h1:text-4xl prose-code:before:hidden prose-code:after:hidden md:prose-h3:text-xl lg:prose-h2:text-3xl"
>
  {#if date}
    <p class="!mb-2 text-lg text-slate-500">
      {new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
    </p>
  {/if}
  <h1>{title}</h1>
  {#if image}
    <img src={image} alt={title} width="1600" height="900" class="!mb-0 !mt-6 aspect-video w-full rounded-lg" />
  {/if}
  {@render children()}
</article>
