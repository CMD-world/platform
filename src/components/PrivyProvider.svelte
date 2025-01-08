<script lang="ts">
  import { PrivyProvider } from "@privy-io/react-auth";
  import { sveltify } from "svelte-preprocess-react";
  import { mainnet } from "viem/chains";
  import { env } from "$env/dynamic/public";

  // Props
  const { children } = $props();
  const react = sveltify({ PrivyProvider });
</script>

<react.PrivyProvider
  appId={env.PUBLIC_PRIVY_APP_ID}
  config={{
    defaultChain: mainnet,
    supportedChains: [mainnet],
    loginMethods: ["email", "wallet"],
  }}
>
  {@render children()}
</react.PrivyProvider>
