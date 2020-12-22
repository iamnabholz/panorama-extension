<script>
  import { onMount } from "svelte";
  import { defaultAnswer } from "../stores/background.js";
  import { slide, fade } from "svelte/transition";

  let y;

  let timer =
    localStorage.getItem("bg-timer") != null
      ? localStorage.getItem("bg-timer")
      : 0;

  let backgroundResponse =
    localStorage.getItem("background") != null
      ? JSON.parse(localStorage.getItem("background"))
      : JSON.parse(defaultAnswer);

  let enabled = localStorage.getItem("bg-toggle") || "true";

  let canReplace = localStorage.getItem("bg-refresh-toggle") || "true";

  let searchQuery = localStorage.getItem("search") || "nasa";

  $: image = backgroundResponse.urls.full;
  $: user = backgroundResponse.user.name;
  $: alt = backgroundResponse.alt_description;
  $: username = backgroundResponse.user.username;

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

  function settings() {
    var opening = chrome.runtime.openOptionsPage();
  }

  async function getBackground() {
    const response = await fetch(
      "https://get-background.nabholz.workers.dev/?cat=" + searchQuery
    );

    if ((await response.status) === 200) {
      const json = await response.json();

      localStorage.setItem("bg-timer", Date.now());
      backgroundResponse = json;
      localStorage.setItem("background", JSON.stringify(json));
    } else {
      console.log("Problem getting a new background");
      console.log(response);
    }
  }
</script>

<style>
  .bg {
    position: absolute;
    z-index: -100;
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
    bottom: 1em;
    left: 1em;
    display: flex;
    align-items: center;
    text-align: left;
    height: 28px;
    mix-blend-mode: difference;
  }

  .text {
    padding-left: 0.5em;
    font-size: 0.7em;
  }

  .icon-settings {
    cursor: pointer;
    mix-blend-mode: difference;
    transition: 0.1s linear;
  }

  .icon-settings:hover {
    height: 28px;
    width: 28px;
    transform: rotateZ(45deg);
  }

  a {
    opacity: 0.8;
  }

  a:hover {
    text-decoration: none;
  }
</style>

<div class="text-container">

  <svg
    title="Open Options"
    on:click={() => {
      settings();
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
      1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0
      0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0
      0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0
      0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65
      1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0
      0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0
      0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0
      1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0
      0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2
      2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>

  {#if enabled == 'true' && y < 180}
    <span class="text" transition:slide>
      <a href={'https://unsplash.com/@' + username}>
        {user}
        <br />
        on Unsplash
      </a>
    </span>
  {/if}
</div>

<div class="bg">
  {#if enabled == 'true'}
    <img {alt} src={image} />
  {/if}

  {#if enabled == 'true' && y > 180}
    <div transition:fade class="gradient" />
  {/if}
</div>

<svelte:window bind:scrollY={y} />
