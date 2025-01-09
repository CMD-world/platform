<script lang="ts">
  import Price from "$components/Price.svelte";
  import Section from "$components/Section.svelte";

  // Props
  const { ...props } = $props();
</script>

<Section {...props} class="py-12 {props.class}" id="pricing">
  <h2 class="h2 mx-auto mb-12 max-w-xl text-center">Save months of developer time, build your AI Agent today!</h2>

  <div class="grid gap-8 md:grid-cols-2">
    <Price
      name="Basic"
      description="Build and test your first AI workflows"
      price={29}
      beforePrice={49}
      features={[
        "Visual workflow builder",
        "5 workflow templates",
        "Basic AI model integration",
        "Up to 1000 workflow runs/month",
        "Community support",
      ]}
      href={"#"}
    />
    <Price
      name="Growth"
      description="Scale your AI operations"
      price={79}
      beforePrice={149}
      features={[
        "Everything in Basic",
        "Unlimited workflow templates",
        "Advanced AI model customization",
        "Unlimited workflow runs",
        "Custom function nodes",
        "Workflow version control",
        "Priority email support",
        "API access for automation",
        "Advanced analytics dashboard",
      ]}
      popular={true}
      href={"#"}
    />
  </div>
</Section>
