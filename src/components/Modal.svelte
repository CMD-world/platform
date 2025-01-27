<script lang="ts">
  import { setContext } from "svelte";

  // Props
  const { trigger, content, ...props } = $props();

  // State
  let open = $state(false);
  let modal = $state<HTMLDialogElement>();
  setContext("modal", { close: () => (open = false) });
</script>

{#if trigger}
  <button onclick={() => (open = true)}>
    {@render trigger(modal)}
  </button>

  <dialog {...props} class="modal {open ? 'modal-open' : ''} {props.class}" bind:this={modal}>
    <div class="modal-box">
      <form method="dialog">
        <button class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2" aria-label="Close" onclick={() => (open = false)}>
          <span class="i-lucide-x"></span>
        </button>
      </form>
      {@render content(modal)}
    </div>

    <form class="modal-backdrop" method="dialog">
      <button onclick={() => (open = false)}>Close</button>
    </form>
  </dialog>
{/if}
