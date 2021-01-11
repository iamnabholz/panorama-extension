<script>
  export let arrowButton = false;
  export let buttonAction = () => console.log("Button Click");
  export let disableButton = false;
</script>

<style>
  button {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 2em;
    min-width: 5em;
    border-radius: 4px;
    border: none;
    text-align: center;
    background-color: rgba(0, 130, 243, 1);
    transition: 0.1s linear;
  }

  p {
    text-transform: uppercase;
    color: #f2f2f2;
    margin: 0;
  }

  button:hover {
    box-shadow: 0 0 3px 1px rgba(52, 144, 220, 0.5);
  }

  button:active {
    box-shadow: 0 0 0px 4px rgba(0, 130, 243, 0.7);
  }

  button:disabled {
    background-color: grey;
    box-shadow: none;
    cursor: default;
  }

  .arrow-button {
    min-width: 2em;
    background-color: whitesmoke;
    outline: none;
    border: none;
  }

  .arrow-button:disabled {
    background-color: lightgray;
    box-shadow: none;
    cursor: default;
  }
</style>

<button
  class:arrow-button={arrowButton}
  disabled={disableButton}
  on:click={buttonAction}>

  {#if !arrowButton}
    <p>
      <slot>Button</slot>
    </p>
  {:else}
    <slot />
  {/if}
</button>
