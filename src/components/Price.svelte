<script lang="ts">
  // Props
  const {
    name,
    price,
    beforePrice,
    description,
    features,
    href,
    popular = false,
  }: {
    name: string;
    price: number;
    beforePrice: number;
    description: string;
    features: string[];
    href?: string;
    popular?: boolean;
  } = $props();
</script>

<div class="relative flex flex-col justify-between rounded-lg border-primary bg-white p-6 shadow-lg dark:bg-black" class:border-2={popular}>
  {#if popular}
    <div class="badge badge-primary absolute -top-3 left-1/2 -translate-x-1/2 hover:bg-primary">POPULAR</div>
  {/if}
  <div>
    <h3 class="h3">{name}</h3>
    <p class="p mt-4">{description}</p>
    <p class="my-6">
      <span class="items-center text-4xl font-extrabold text-slate-900 dark:text-slate-100">
        <span class="text-xl text-slate-400 line-through dark:text-slate-600">${beforePrice}</span>
        ${price}
      </span>
    </p>
    <ul class="mt-4 space-y-4">
      {#each features as feature}
        <li class="flex items-center">
          <span class="i-lucide-check text-green-500"></span>
          <span class="p ml-2">{feature}</span>
        </li>
      {/each}
    </ul>
  </div>
  <a class="btn btn-primary mt-4 w-full" {href}>Build AI Agent</a>
</div>
