<script lang="ts">
  import { setContext } from "svelte";

  // Props
  const { trigger, children, ...props } = $props();

  // State
  let modal = $state<HTMLDialogElement>();
  setContext("modal", { close: () => modal?.close() });
</script>

{#if trigger}
  <button onclick={() => modal?.showModal()}>
    {@render trigger()}
  </button>

  <dialog {...props} class="modal {props.class}" bind:this={modal}>
    <div class="modal-box">
      <form method="dialog">
        <button class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2" aria-label="Close">
          <span class="i-lucide-x"></span>
        </button>
      </form>
      {@render children()}
    </div>

    <form class="modal-backdrop" method="dialog">
      <button>Close</button>
    </form>
  </dialog>
{/if}
