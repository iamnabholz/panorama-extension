<script>
  import Background from "./lib/Background.svelte";
  import Reddit from "./lib/Reddit.svelte";
  import Weather from "./lib/Weather.svelte";
  import Shorcuts from "./lib/Shorcuts.svelte";
  import { settings } from "./stores";
  import { slide } from "svelte/transition";
  import Today from "./lib/Today.svelte";
</script>

<main>
  <div class="side-bar">
    {#if $settings.dateActive}
      <span transition:slide>
        <Today />
      </span>
    {/if}
    {#if $settings.weatherActive}
      <span transition:slide>
        <Weather />
      </span>
    {/if}
    {#if $settings.sitesActive}
      <span transition:slide>
        <Shorcuts />
      </span>
    {/if}
  </div>

  {#if $settings.redditActive}
    <Reddit />
  {/if}
</main>

<Background />

<style>
  main {
    padding: 6vh 2vh;
    height: 100vh;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    column-gap: 4rem;
  }

  .side-bar {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .side-bar span {
    padding-bottom: 2vh;
  }

  @media screen and (max-width: 680px) {
    main {
      flex-direction: column;
    }

    .side-bar {
      width: 100%;
    }
  }
</style>
