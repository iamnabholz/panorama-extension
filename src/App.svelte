<script>
  import Weather from "./views/Weather.svelte";
  import SearchBar from "./views/SearchBar.svelte";
  import TopSites from "./views/TopSites.svelte";
  import Reddit from "./views/Reddit.svelte";
  import Background from "./views/Background.svelte";

  let weather = localStorage.getItem("weather-toggle") || "true";
  let search = localStorage.getItem("search-toggle") || "true";
  let sites = localStorage.getItem("sites-toggle") || "true";
  let reddit = localStorage.getItem("reddit-toggle") || "true";
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
  <section class="header">
    {#if weather == 'true'}
      <Weather />
    {/if}
  </section>

  {#if search == 'true'}
    <section class="search-bar">
      <SearchBar />
    </section>
  {/if}

  {#if sites == 'true'}
    <section class="top-sites">
      <TopSites />
    </section>
  {/if}

  {#if reddit == 'true'}
    <section class="reddit">
      <Reddit />
    </section>
  {/if}
</main>
