<script lang="ts">
  import Section from "$components/Section.svelte";

  // Props
  const { ...props } = $props();
</script>

{#snippet question(title: string, answer: string)}
  <div class="collapse bg-base-200">
    <input type="checkbox" name="accordion" />
    <div class="collapse-title text-xl font-medium">{title}</div>
    <div class="collapse-content">
      <p>{answer}</p>
    </div>
  </div>
{/snippet}

<Section {...props} class="py-12 {props.class}" id="faq">
  <h2 class="h2 mb-8">Frequently Asked Questions</h2>

  <div class="grid gap-4">
    {@render question(
      "What do I get exactly?",
      "When you purchase our product, you'll receive full access to all features and functionality, including regular updates and customer support. The package includes all advertised components with no hidden fees.",
    )}
    {@render question(
      "Can I get a refund?",
      "Yes, we offer a 30-day money-back guarantee. If you're not completely satisfied with your purchase, simply contact our support team within 30 days for a full refund, no questions asked.",
    )}
    {@render question(
      "I have another question",
      "If you have any other questions, please don't hesitate to contact our support team. We're available 24/7 via email or chat and will be happy to help you with any inquiries.",
    )}
  </div>
</Section>
