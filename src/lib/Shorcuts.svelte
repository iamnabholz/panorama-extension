<script>
  import { onMount } from "svelte";
  import browser from "webextension-polyfill";

  let result = [];

  const trimShortcutTitle = (title) => {
    if (title.length > 18) {
      title = title.slice(0, 16);
      title = title + "...";
    }
    return title;
  };

  onMount(() => {
    browser.topSites.get().then((sites) => {
      result = sites
        .filter((data) => /^((http|https|ftp):\/\/)/.test(data.url))
        .slice(0, 10);
    });
  });
</script>

<section class="column-wrapper">
  {#if result.length == 0}
    <p class="empty-list">Top sites list is empty.</p>
  {/if}

  {#each result as site}
    <a title={site.title || site.url} href={site.url}>
      {#if site.favicon != null}
        <img alt="Favicon" src={site.favicon} />
      {:else}
        <img
          alt="Favicon"
          src={"https://www.google.com/s2/favicons?sz=48&domain=" +
            new URL(site.url).hostname}
        />
      {/if}
      <span class="shortcut-text">
        {trimShortcutTitle(site.title || site.url)}
      </span>
    </a>
  {/each}
</section>

<style>
  section {
    padding-top: 1rem;
    padding-left: 4px;
    gap: 12px;
  }

  a {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--light-color);
    text-shadow: var(--text-shadow);
  }

  span {
    white-space: nowrap;
    max-width: min(180px, 100%);
  }

  a:hover img {
    transform: scale(1.1);
  }

  a:hover {
    text-decoration: none;
  }

  img {
    width: 20px;
    height: 20px;
    filter: drop-shadow(var(--image-shadow));
    transition: all 150ms linear;
  }

  .empty-list {
    color: white;
    text-shadow: var(--text-shadow);
  }

  @media screen and (max-width: 680px) {
    img {
      width: 32px;
      height: 32px;
    }

    section {
      padding: 0;
      flex-direction: row;
      flex-wrap: wrap;
    }

    .shortcut-text {
      opacity: 0;
      display: none;
    }
  }
</style>
