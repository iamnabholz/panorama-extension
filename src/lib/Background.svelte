<script>
  import { onDestroy, onMount } from "svelte";
  import browser from "webextension-polyfill";
  import LoadingIndicator from "./components/LoadingIndicator.svelte";
  import Options from "./Options.svelte";
  import {
    optionsPageOpened,
    backgroundQuery,
    backgroundColor,
    updateSetting,
    settings,
    getNewBackground,
  } from "../stores.js";
  import { fade, slide } from "svelte/transition";
  import { checkTimerDone } from "../utils";

  let imageElement;
  let isLoadingImage = false;

  let lastUpdateTime =
    localStorage.getItem("bg-up") != null
      ? JSON.parse(localStorage.getItem("bg-up"))
      : 0;

  let currentImage =
    localStorage.getItem("bg-resp") != null
      ? JSON.parse(localStorage.getItem("bg-resp"))
      : null;

  let backgroundImageSrc = "";
  let user = "";
  let alt = "";
  let username = "";

  $: if (currentImage != null) {
    backgroundImageSrc = currentImage.urls.full;
    user = currentImage.user.name;
    alt = currentImage.alt_description;
    username = currentImage.user.username;
  }

  const getImage = () => {
    isLoadingImage = true;
    browser.runtime
      .sendMessage({
        message: "fetch-background",
        query: $backgroundQuery,
      })
      // IF WE RECEIVE AN ERROR OR SOMETHING WHEN DOING THE REQUEST WE SHOULD'NT SAVE THIS INFORMATION OF COURSE
      .then((message) => {
        if (message !== undefined) {
          localStorage.setItem("bg-up", Date.now().toString());
          localStorage.setItem("bg-resp", JSON.stringify(message.response));

          currentImage = message.response;
        } else {
          isLoadingImage = false;
          if (currentImage == null) {
            updateSetting("backgroundActive");
          }
        }
        imageElement.onload = () => {
          isLoadingImage = false;
        };
      });
  };

  onMount(() => {
    if ($settings.backgroundActive) {
      if (checkTimerDone(lastUpdateTime) && $settings.updateBackground) {
        getImage();
      }

      imageElement.onload = () => {
        isLoadingImage = false;
      };
    }
  });

  const unsubscribe = getNewBackground.subscribe((value) => {
    if (value === true) {
      getNewBackground.set(false);
      getImage();
    }
  });

  onDestroy(unsubscribe);
</script>

{#if $optionsPageOpened}
  <Options />
{/if}

<div class="background-information">
  <button
    on:click={() => {
      //getImage();
      optionsPageOpened.set(!$optionsPageOpened);
    }}
  >
    <svg
      class:open={$optionsPageOpened}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      style="transition: transform 150ms ease-in-out;"
    >
      <path
        d="M24 13.616v-3.232c-1.651-.587-2.693-.752-3.219-2.019v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.749-2.69 2.027-3.222h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286c-.743-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021zm-12 3.384c-2.762 0-5-2.239-5-5s2.238-5 5-5 5 2.239 5 5-2.238 5-5 5zm3-5c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3z"
      />
    </svg>
  </button>

  {#if $settings.backgroundActive}
    <a
      transition:slide
      href={"https://unsplash.com/@" + username}
      target="_blank"
    >
      {user}
      <br />
      on Unsplash
    </a>
  {/if}

  {#if isLoadingImage}
    <LoadingIndicator />
  {/if}
</div>

<div class="background-container">
  {#if $settings.backgroundActive}
    <img
      loading="eager"
      transition:fade
      bind:this={imageElement}
      src={backgroundImageSrc}
      {alt}
    />
  {:else}
    <div
      style="background: linear-gradient({Math.random() * 360 +
        'deg'}, {$backgroundColor} 20%, #010314 100%);"
      class="color-background"
    ></div>
  {/if}
</div>

<style>
  .background-container {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -100;
  }

  .color-background {
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

  .background-information {
    position: fixed;
    left: 1rem;
    bottom: 1rem;
    z-index: 100;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  a {
    font-size: 14px;
    color: var(--light-color);
    text-shadow: var(--text-shadow);
    opacity: 0.6;
    transition: all 150ms ease-in-out;
  }

  a:hover {
    text-decoration: underline;
    opacity: 1;
  }

  button {
    border: none;
    color: var(--light-color);
    display: flex;
    padding: 6px;
    opacity: 0.6;
    background-color: transparent;
    transition: all 150ms ease-in-out;
  }

  button:hover,
  button:focus {
    box-shadow: none;
    border: none;
    opacity: 1;
  }

  .open {
    transform: rotateZ(160deg);
  }

  svg {
    filter: drop-shadow(var(--image-shadow));
  }
</style>
