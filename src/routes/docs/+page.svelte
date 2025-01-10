<script lang="ts">
  import { onMount } from "svelte";
  import SwaggerUI from "swagger-ui";
  import "swagger-ui/dist/swagger-ui.css";

  onMount(async () => {
    SwaggerUI({
      spec: await fetch("/openapi").then((body) => body.json()),
      dom_id: "#swagger-ui",
    });
  });
</script>

<svelte:head>
  <title>SwaggerUI</title>
</svelte:head>

<div id="swagger-ui"></div>
