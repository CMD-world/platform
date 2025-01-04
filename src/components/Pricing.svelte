<script lang="ts">
  import Price from "$components/Price.svelte";
  import Section from "$components/Section.svelte";

  // Props
  const { ...props } = $props();
</script>

<Section {...props} class="py-12 {props.class}" id="pricing">
  <h2 class="h2 mx-auto mb-12 max-w-screen-sm text-center">Save hours of repetitive code, build your MVP, get profitable!</h2>

  <div class="grid gap-8 md:grid-cols-2">
    <Price
      name="Starter MVP"
      description="Perfect for validating your product idea"
      price={49}
      features={["Essential features", "Basic analytics", "Up to 100 users", "Email support"]}
      href={"/checkout"}
    />
    <Price
      name="Growth MVP"
      description="Scale your validated MVP"
      price={79}
      features={[
        "All features",
        "Advanced analytics",
        "Up to 1000 users",
        "Email support",
        "Unlimited users",
        "Priority support",
        "Custom branding",
        "API access",
      ]}
      popular={true}
      href={"/checkout"}
    />
  </div>
</Section>
