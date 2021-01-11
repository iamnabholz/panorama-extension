<script>
  import { onMount, onDestroy } from "svelte";
  import { defaultAnswer } from "../stores/background.js";
  import { slide, fade, fly } from "svelte/transition";

  import LoadingIndicator from "../components/LoadingIndicator.svelte";
  import Options from "./Options.svelte";

  import {
    background,
    searchBackground,
    backgroundColor
  } from "../stores/options.js";

  let y;

  let loadingBackground = false;
  let imgElement;

  let timer =
    localStorage.getItem("bg-timer") != null
      ? localStorage.getItem("bg-timer")
      : 0;

  let backgroundResponse =
    localStorage.getItem("background") != null
      ? JSON.parse(localStorage.getItem("background"))
      : JSON.parse(defaultAnswer);

  $: enabled = $background;
  let canReplace = localStorage.getItem("bg-refresh-toggle") || "true";

  let searchQuery = $searchBackground;

  $: image = backgroundResponse.urls.full;
  $: user = backgroundResponse.user.name;
  $: alt = backgroundResponse.alt_description;
  $: username = backgroundResponse.user.username;

  let showingSettings = false;

  onMount(() => {
    if (parseInt(timer) === 0) {
      getBackground();
    } else if (enabled === "true" && canReplace === "true") {
      let d = parseInt(timer) + 6600000;
      if (d < Date.now()) {
        getBackground();
      }
    }
  });

  function showSettings() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    showingSettings = true;
    //var opening = chrome.runtime.openOptionsPage();
  }

  async function getBackground() {
    loadingBackground = true;
    const response = await fetch(
      "https://get-background.nabholz.workers.dev/?cat=" + searchQuery
    );

    if ((await response.status) === 200) {
      const json = await response.json();

      localStorage.setItem("bg-timer", Date.now());
      backgroundResponse = json;
      localStorage.setItem("background", JSON.stringify(json));
    } else {
      loadingBackground = false;

      console.log("Problem getting a new background");
      console.log(response);
    }

    imgElement.onload = () => {
      loadingBackground = false;
    };
  }

  const unsubscribe = searchBackground.subscribe(value => {
    if (searchQuery !== value) {
      searchQuery = value;
      getBackground();
    }
  });

  onDestroy(unsubscribe);
</script>

<style>
  .background {
    position: absolute;
    z-index: -100;
  }

  .color-background {
    position: fixed;
    display: block;
    width: 100vw;
    height: 100vh;
  }

  img {
    position: fixed;
    display: block;
    width: 100vw;
    height: 100vh;
    object-fit: cover;
  }

  .gradient {
    position: fixed;
    display: block;
    width: 100vw;
    height: 100vh;
    background: rgba(20, 20, 20, 0.35);
  }

  .text-container {
    position: fixed;
    bottom: 0.6rem;
    left: 0.6rem;
    display: flex;
    align-items: center;
    text-align: left;
    height: 32px;
    mix-blend-mode: difference;
  }

  .text a {
    display: block;
    color: white;
    padding-left: 0.5em;
    font-size: 0.7em;
    transition: 0.1s linear;
  }

  .text a:hover {
    transform: translateY(-1px);
    text-decoration: underline;
  }

  .button-container {
    cursor: pointer;
    height: 30px;
    width: 30px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    transition: background-color 0.1s linear;
  }

  .open-button {
    mix-blend-mode: normal;
    background-color: white;
    box-shadow: 0 1px 2px 0 grey;
  }

  .icon-settings {
    stroke: white;
    opacity: 0.8;
    mix-blend-mode: difference;
    transition: 0.1s linear;
  }

  .icon-settings:hover {
    height: 28px;
    width: 28px;
    transform: rotateZ(45deg);
  }

  .options-menu {
    position: fixed;
    bottom: 3.2rem;
    left: 0.6rem;
    width: min(380px, 100%);
    z-index: 10;
  }

  a {
    opacity: 0.8;
  }

  a:hover {
    text-decoration: none;
  }
</style>

<div class="text-container">
  <div class:open-button={showingSettings} class="button-container">
    {#if !showingSettings}
      <svg
        title="Open Options"
        on:click={() => {
          showSettings();
        }}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="icon-settings">
        <circle cx="12" cy="12" r="3" />
        <path
          d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0
          1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2
          2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0
          0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65
          0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1
          2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0
          0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65
          0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51
          1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0
          2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2
          0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    {:else}
      <svg
        title="Close Options"
        on:click={() => {
          showingSettings = false;
        }}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    {/if}
  </div>

  {#if enabled == 'true' && y < 180}
    <span class="text" transition:slide>
      <a href={'https://unsplash.com/@' + username}>
        {user}
        <br />
        on Unsplash
      </a>
    </span>

    {#if loadingBackground}
      <div transition:fade style="margin-left: 10px;">
        <LoadingIndicator />
      </div>
    {/if}
  {/if}
</div>

<div class="background">
  {#if enabled == 'true'}
    <img
      transition:fade={{ duration: 120 }}
      bind:this={imgElement}
      {alt}
      src={image} />
  {:else}
    <div
      style="background-color: {$backgroundColor};"
      class="color-background" />
  {/if}

  {#if y > 180}
    <div transition:fade class="gradient" />
  {/if}
</div>

<svelte:window bind:scrollY={y} />

{#if showingSettings}
  <div class="options-menu" transition:fly={{ x: -200 }}>
    <Options />
  </div>
{/if}
