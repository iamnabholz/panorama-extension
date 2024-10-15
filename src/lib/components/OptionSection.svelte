<script>
  import { slide } from "svelte/transition";
  export let showOptions = false;
  export let toggleOptions;
</script>

<div class="option-section">
  <button on:click={toggleOptions}>
    <h3 class:opacity={showOptions}>
      <svg
        style="transition: transform 150ms linear;"
        class:open={showOptions}
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 11.996z"
        />
      </svg>
      <slot name="title">New Section</slot>
    </h3>
  </button>

  {#if showOptions}
    <div transition:slide>
      <slot name="content">
        <p>Options to change</p>
      </slot>
    </div>
  {/if}
</div>

<style>
  .option-section {
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .option-section:hover h3 {
    opacity: 1;
  }

  button {
    border: none;
    background-color: transparent;
    padding: 12px;
    text-align: left;
    justify-content: flex-start;
  }

  button:hover,
  button:active,
  button:focus {
    box-shadow: none;
  }

  h3 {
    opacity: 0.6;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-color);
    transition: opacity 150ms ease-in-out;
  }

  .open {
    transform: rotateZ(90deg);
  }

  .opacity {
    opacity: 1;
  }
</style>
