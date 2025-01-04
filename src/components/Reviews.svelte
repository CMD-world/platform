<script lang="ts">
  import Review from "$components/Review.svelte";
  import Section from "$components/Section.svelte";

  // Props
  const { ...props } = $props();

  // State
  const reviews = [
    {
      author: "Alex Thompson",
      review: "As a frontend developer, this is a game-changer. The tech stack choices are modern and thoughtful. Worth every penny.",
      image: "",
    },
    {
      author: "Sarah Johnson",
      review: "Incredible toolkit that makes development so much faster. The components are well-designed and easy to customize.",
      image: "",
    },
    {
      author: "David Smith",
      review: "Everything I needed to get started quickly. The architecture decisions are solid and it's very maintainable.",
      image: "",
    },
    {
      author: "Emily Rodriguez",
      review: "As a fullstack developer, this is exactly what I was looking for. The integration between frontend and backend is seamless.",
      image: "",
    },
  ];
</script>

<Section {...props} class="py-12 {props.class}" id="reviews">
  <h2 class="h2 mx-auto mb-12 max-w-screen-sm text-center">Here's what other people are saying:</h2>

  <div class="flex flex-wrap justify-center gap-x-4 gap-y-12">
    {#each reviews as { author, review, image }}
      <Review {author} {review} {image} class="max-w-md py-0" />
    {/each}
  </div>
</Section>
