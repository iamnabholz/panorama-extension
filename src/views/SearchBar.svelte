<script>
  import { fly } from "svelte/transition";
  import { onMount } from "svelte";

  import { defaultSearch } from "../stores/options.js";

  let search = "";
  let showButt = false;

  onMount(() => {
    search = "";
  });

  function openLink(service) {
    if (service == "g") {
      if (search != null && search.replace(/\s/g, "") != "") {
        window.open("http://google.com/search?q=" + search, "_self");
      } else {
        window.open("http://google.com/", "_blank");
      }
    } else if (service == "d") {
      if (search != null && search.replace(/\s/g, "") != "") {
        window.open("http://duckduckgo.com/" + search, "_self");
      } else {
        window.open("http://duckduckgo.com/", "_blank");
      }
    } else if (service == "w") {
      if (search != null && search.replace(/\s/g, "") != "") {
        window.open("http://wikipedia.org/wiki/" + search, "_self");
      } else {
        window.open("http://wikipedia.org/", "_blank");
      }
    } else if (service == "e") {
      if (search != null && search.replace(/\s/g, "") != "") {
        window.open("https://ecosia.org/search?q=" + search, "_self");
      } else {
        window.open("https://ecosia.org/", "_blank");
      }
    }
  }
</script>

<style>
  main {
    width: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  input[type="text"] {
    font-size: 0.9em;
    text-align: center;
    padding: 0 1.5em;
    font-weight: 500;
    height: 3.4em;
    width: 100%;
    background: #ffffff;
    border-radius: 50px;
    border: 0;
    transition: 0.15s;
    box-shadow: 0px 1px 3px 2px rgba(0, 0, 0, 0.08);
  }

  input[type="text"]:focus {
    height: 3.9em;
    text-align: left;
    padding: 0 1.5em;
    border: 0;
    outline: none;
    box-shadow: 0px 2px 5px 2px rgba(88, 88, 88, 0.1);
  }

  input[type="image"] {
    image-rendering: -webkit-optimize-contrast;
    outline: none;
    border: 0;
    transition: 0.15s;
    height: 32px;
    width: 32px;
  }

  input[type="image"]:hover {
    height: 36px;
    width: 36px;
  }

  .buttons {
    position: absolute;
    top: 0;
    right: 1.5em;
    display: flex;
    justify-content: center;
    height: 100%;
    align-items: center;
  }

  .selected {
    order: -1;
  }
</style>

<main>
  <input
    title="Search Bar"
    bind:value={search}
    type="text"
    placeholder="Search the web"
    on:focus={() => {
      showButt = true;
    }}
    on:focusout={() => {
      showButt = false;
    }}
    on:keydown={key => {
      if (key.keyCode === 13) {
        key.preventDefault();
        openLink($defaultSearch);
      }
    }} />

  {#if showButt}
    <div transition:fly={{ duration: 300, x: 20 }} class="buttons">
      <input
        class:selected={$defaultSearch === 'g'}
        title="Search with Google"
        alt="Google Icon"
        src="/icons/google-ico.png"
        type="image"
        on:click={() => {
          openLink('g');
        }} />

      <input
        class:selected={$defaultSearch === 'd'}
        title="Search with DuckDuckGo"
        alt="DuckDuckGo Icon"
        src="/icons/duckduckgo-ico.png"
        type="image"
        on:click={() => {
          openLink('d');
        }} />

      <input
        class:selected={$defaultSearch === 'e'}
        title="Search with Ecosia"
        alt="Ecosia Icon"
        src="/icons/ecosia-ico.png"
        type="image"
        on:click={() => {
          openLink('e');
        }} />

      <input
        class:selected={$defaultSearch === 'w'}
        title="Search on Wikipedia"
        alt="Wikipedia Icon"
        src="/icons/wikipedia-ico.png"
        type="image"
        on:click={() => {
          openLink('w');
        }} />

    </div>
  {/if}
</main>
