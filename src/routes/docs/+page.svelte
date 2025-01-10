<script lang="ts">
  import { onMount } from "svelte";
  import "swagger-ui-dist/swagger-ui.css";
  import SwaggerUIBundle from "swagger-ui-dist/swagger-ui-bundle";
  import SwaggerUIStandalonePreset from "swagger-ui-dist/swagger-ui-standalone-preset";

  onMount(async () => {
    SwaggerUIBundle({
      spec: await fetch("/openapi").then((body) => body.json()),
      dom_id: "#swagger-ui",
      deepLinking: true,
      plugins: [SwaggerUIBundle.plugins.DownloadUrl],
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
    });
  });
</script>

<svelte:head>
  <title>Docs - AI Agent</title>
</svelte:head>

<div id="swagger-ui"></div>
