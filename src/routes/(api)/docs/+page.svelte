<script lang="ts">
  import { onMount } from "svelte";
  import SwaggerUI from "swagger-ui";
  import "swagger-ui/dist/swagger-ui.css";

  onMount(async () => {
    const openapi = await fetch("/openapi");
    SwaggerUI({
      spec: await openapi.json(),
      dom_id: "#swagger-ui-container",
    });
  });
</script>

<svelte:head>
  <title>API - AI Agent</title>
</svelte:head>

<div id="swagger-ui-container"></div>
