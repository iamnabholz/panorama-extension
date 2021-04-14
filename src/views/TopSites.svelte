<script>
  import { onMount } from "svelte";

  let result =
    localStorage.getItem("sites") != null
      ? JSON.parse(localStorage.getItem("sites"))
      : [];

  onMount(() => {
    if (typeof browser !== "undefined") {
      let sites = browser.topSites.get({ includeFavicon: true });
      sites.then(si => {
        result = si.slice(0, 10);
      });
    } else {
      chrome.topSites.get(sites => {
        if (
          result.length == 0 ||
          JSON.stringify(result) != JSON.stringify(sites)
        ) {
          result = sites.filter(data =>
            /^((http|https|ftp):\/\/)/.test(data.url)
          );
          result = result.slice(0, 10);
          localStorage.setItem("sites", JSON.stringify(result));
        }
        //result = sites;
      });
    }
  });
</script>

<style>
  main {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .link-tile {
    cursor: pointer;
    display: grid;
    justify-items: center;
    align-items: center;
    text-align: center;
    background-color: white;
    color: black;
    height: 46px;
    width: 46px;
    border-radius: 5px;
    transition: 0.3s;
    box-shadow: 0px 1px 5px 2px rgba(88, 88, 88, 0.1);
  }

  .link-tile:hover,
  .link-tile:active {
    height: 54px;
    width: 54px;
    box-shadow: 0px 2px 6px 3px rgba(88, 88, 88, 0.2);
  }
  img {
    width: 60%;
    height: 60%;
    object-fit: cover;
    image-rendering: -webkit-optimize-contrast;
  }

  .divider {
    padding: 0 0.7em;
  }

  .empty-list {
    mix-blend-mode: difference;
  }

  @media screen and (max-width: 730px) {
    main {
      display: grid;
      gap: 6px;
      grid-template-columns: repeat(5, 60px);
      grid-template-rows: repeat(2, 60px);
      align-items: center;
      justify-items: center;
    }
    .divider {
      display: none;
    }
  }
  @media screen and (max-width: 360px) {
    main {
      grid-template-columns: repeat(3, 60px);
      grid-template-rows: repeat(4, 60px);
    }
  }
</style>

<main>
  {#if result.length == 0}
    <p class="empty-list">You don't have any top sites yet.</p>
  {/if}

  {#each result as site, i}
    {#if i > 0}
      <div class="divider" />
    {/if}
    <a href={site.url}>
      <section class="link-tile" title={site.title}>

        {#if site.favicon != null}
          <img alt="Favicon" src={site.favicon} />
        {:else}
          <img
            alt="Favicon"
            src={'https://api.faviconkit.com/' + new URL(site.url).hostname + '/44'} />
        {/if}

      </section>
    </a>
  {/each}
</main>
