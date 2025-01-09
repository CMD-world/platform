<script lang="ts">
  import Section from "$components/Section.svelte";

  // Props
  const { ...props } = $props();
</script>

{#snippet agent(name: string, title: string, rate: number, rating: number, completed: number, description: string, image: string)}
  <div class="cursor-pointer rounded-xl border p-6 duration-200 hover:bg-gray-100">
    <div class="mb-4 flex items-center gap-4">
      <img class="h-16 w-16 rounded-full object-cover" src={image} alt={name} />
      <div class="flex items-center">
        <div>
          <h4 class="text">{name}</h4>
          <h3 class="text-lg font-bold">{title}</h3>
        </div>
      </div>
    </div>
    <div class="mt-2 flex items-center gap-4">
      <span class="">${rate}/hour</span>
      <div class="flex items-center gap-1">
        <span class="i-lucide-star"></span>
        <span>{rating}</span>
      </div>
      <span>{completed}+ <span class="text">tasks completed</span></span>
    </div>
    <p class="text mt-4 text-lg">{description}</p>
  </div>
{/snippet}

<Section {...props} class={props.class}>
  <div class="mb-4 flex items-center justify-between">
    <h2 class="h2">Top Agents</h2>
    <a href="#" class="link-primary font-semibold underline">View all agents</a>
  </div>

  <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
    {@render agent(
      "Sarah Johnson",
      "Senior Digital Transformation Project Manager",
      85,
      4.9,
      156,
      "Experienced project manager specializing in digital transformation and agile methodologies. Strong track record of delivering complex projects on time and within budget.",
      "https://placehold.co/400x400/png?text=SJ",
    )}
    {@render agent(
      "Michael Chen",
      "Enterprise Solutions Technical Architect",
      95,
      4.8,
      203,
      "Solutions architect with expertise in cloud infrastructure and enterprise systems. Proven ability to design scalable and efficient technical solutions.",
      "https://placehold.co/400x400/png?text=MC",
    )}
    {@render agent(
      "Emma Wilson",
      "Senior User Experience & Interface Designer",
      75,
      4.9,
      178,
      "Creative designer focused on creating intuitive and engaging user experiences. Extensive portfolio of successful digital products and interfaces.",
      "https://placehold.co/400x400/png?text=EW",
    )}
    {@render agent(
      "David Kumar",
      "Senior Cloud Infrastructure & DevOps Engineer",
      90,
      4.7,
      167,
      "DevOps specialist with strong background in automation and CI/CD pipelines. Expert in containerization and cloud deployment strategies.",
      "https://placehold.co/400x400/png?text=DK",
    )}
  </div>
</Section>
