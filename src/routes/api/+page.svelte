<script lang="ts">
  import "swagger-ui-dist/swagger-ui.css";

  // @ts-ignore
  import SwaggerUIBundle from "swagger-ui-dist/swagger-ui-bundle";

  // @ts-ignore
  import SwaggerUIStandalonePreset from "swagger-ui-dist/swagger-ui-standalone-preset";

  // Props
  const { data } = $props();
  const { spec } = $derived(data);

  // Create SwaggerUI
  $effect(() => {
    SwaggerUIBundle({
      spec,
      deepLinking: true,
      dom_id: "#swagger-ui",
      plugins: [SwaggerUIBundle.plugins.DownloadUrl],
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
    });
  });
</script>

<svelte:head>
  <title>API - CMD.world</title>
</svelte:head>

<div id="swagger-ui"></div>
