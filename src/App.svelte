<script>
  import Weather from "./views/Weather.svelte";
  import SearchBar from "./views/SearchBar.svelte";
  import TopSites from "./views/TopSites.svelte";
  import Reddit from "./views/Reddit.svelte";
  import Background from "./views/Background.svelte";

  import { fade, fly, slide } from "svelte/transition";

  import { weather, search, sites, reddit } from "./stores/options.js";
</script>

<style>
  main {
    display: flex;
    flex-direction: column;
    width: min(80%, 800px);
    padding: 2em;
    margin: 0 auto;
  }

  section {
    height: 120px;
    display: flex;
    justify-content: center;
  }

  .header {
    height: 120px;
  }

  .search-bar,
  .top-sites {
    height: 80px;
  }
  .reddit {
    height: auto;
    padding-top: 8%;
  }

  @media screen and (max-width: 730px) {
    .top-sites {
      height: auto;
    }
  }
</style>

<Background />

<main>
  <div class="header">
    {#if $weather === 'true'}
      <section transition:slide>
        <Weather />
      </section>
    {/if}
  </div>

  {#if $search === 'true'}
    <section transition:slide class="search-bar">
      <SearchBar />
    </section>
  {/if}

  {#if $sites === 'true'}
    <section transition:slide class="top-sites">
      <TopSites />
    </section>
  {/if}

  {#if $reddit === 'true'}
    <section transition:fly class="reddit">
      <Reddit />
    </section>
  {/if}
</main>
