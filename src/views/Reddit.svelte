<script>
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";
  import Post from "../components/Post.svelte";

  let inputSpan;
  let isShowing = false;

  let subreddit = localStorage.getItem("subb") || "space";
  let selectedSort = localStorage.getItem("sotr") || "hot";

  let allPosts =
    localStorage.getItem("postansgos") != null
      ? JSON.parse(localStorage.getItem("postansgos"))
      : [];

  $: showingPosts = allPosts.slice(0, 4) || [];

  $: postsTime =
    localStorage.getItem("tiii") != null ? localStorage.getItem("tiii") : 0;

  onMount(() => {
    inputSpan.innerHTML = subreddit;

    let d = parseInt(postsTime) + 500000;

    if (d < Date.now()) {
      getPosts();
    }
  });

  function subredditChange() {
    if (inputSpan.innerHTML == "") {
      inputSpan.innerHTML = "all";
      subreddit = "all";
      localStorage.setItem("subb", subreddit);

      getPosts();
    }

    if (inputSpan.innerHTML != null && inputSpan.innerHTML != subreddit) {
      subreddit = inputSpan.innerHTML;
      localStorage.setItem("subb", subreddit);

      getPosts();
    } else {
      inputSpan.innerHTML = subreddit;
    }
  }

  async function getPosts() {
    let feed = await fetch(
      "https://www.reddit.com/r/" +
        subreddit +
        "/" +
        selectedSort +
        ".json?limit=60"
    );
    const json = await feed.json();
    if (json.data != null) {
      let data = json.data.children;
      let filtered = data.filter(el => el.data.stickied != true);

      filtered = filtered.slice(0, 50);

      if (filtered != allPosts) {
        localStorage.setItem("postansgos", JSON.stringify(filtered));
        localStorage.setItem("tiii", Date.now());
        allPosts = filtered;
        isShowing = false;
      }
    } else {
      allPosts = [];
      isShowing = false;
    }
  }

  function showPosts() {
    if (isShowing === false) {
      showingPosts = allPosts;
      isShowing = true;
    } else {
      showingPosts = allPosts.slice(0, 4);
      isShowing = false;
    }
  }
</script>

<style>
  main {
    width: 100%;
  }
  .reddit-controls {
    height: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .reddit-controls img {
    padding: 0 0.5em;
  }

  .reddit-controls p {
    padding: 1em;
  }

  .control-arrow {
    box-shadow: 0px 1px 5px 2px rgba(88, 88, 88, 0.1);
    border-radius: 50px;
    background-color: white;
    display: flex;
    align-items: center;
    height: 60%;
  }

  .control-arrow button {
    background-color: transparent;
    outline: none;
    border: none;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .control-arrow img {
    width: 18px;
    padding: 0;
  }

  .open {
    transform: rotateZ(180deg);
  }

  .reddit-posts-container {
    display: grid;
    grid-template-columns: 49.5% 49.5%;
    column-gap: 1%;
    row-gap: 1vh;
  }

  .input-container {
    background-color: white;
    border-radius: 50px;
    height: 60%;
    padding-right: 1em;
    display: flex;
    align-items: center;
    box-shadow: 0px 1px 5px 2px rgba(88, 88, 88, 0.1);
  }

  span {
    border-radius: 5px;
    font-size: 0.9em;
    border: none;
    -webkit-padding: 0.6em 0.3em;
    padding: 0.6em 0.3em;
    min-width: 3em;
    transition: min-width 0.15s linear;
  }

  span:focus {
    min-width: 6em;
  }

  select {
    font-size: 0.8em;
    border: none;
    margin-left: 1em;
    width: 5em;
    -moz-appearance: none; /* Firefox */
    -webkit-appearance: none; /* Safari and Chrome */
    appearance: none;
    height: 34px;
    background: url(/icons/chevron-down.svg) no-repeat right white;
    background-size: 22px;
  }

  @media screen and (max-width: 580px) {
    .reddit-posts-container {
      grid-template-columns: 100%;
      row-gap: 1%;
    }
  }
</style>

<main>
  <section class="reddit-controls">
    <div class="input-container">
      <a href={'https://www.reddit.com/r/' + subreddit + '/' + selectedSort}>
        <img alt="Reddit Icon" src="/icons/reddit-ico.png" />
      </a>
      <span
        spellcheck="false"
        bind:this={inputSpan}
        contenteditable="true"
        on:focusout={() => {
          subredditChange();
        }}
        on:keydown={key => {
          if (key.keyCode === 13) {
            key.preventDefault();
            inputSpan.blur();
            subredditChange();
          }
          let char = String.fromCharCode(key.keyCode);
          if (/[A-Za-z0-9_]/.test(char) == false && key.keyCode != 8 && key.keyCode != 37 && key.keyCode != 39 && key.keyCode != 46) {
            key.preventDefault();
          }
        }} />

      <select
        bind:value={selectedSort}
        on:change={() => {
          if (selectedSort != localStorage.getItem('sotr')) {
            localStorage.setItem('sotr', selectedSort);
            getPosts();
          }
        }}>
        <option value="hot">
          <p>Hot</p>
        </option>
        <option value="new">
          <p>New</p>
        </option>
        <option value="rising">
          <p>Rising</p>
        </option>
      </select>
    </div>

    {#if allPosts.length > 4}
      <div transition:slide class="control-arrow">
        <button
          on:click={() => {
            showPosts();
          }}>
          <img
            class:open={isShowing === true}
            src="icons/chevron-down.svg"
            alt="Left Arrow" />
        </button>
      </div>
    {/if}
  </section>

  <section class="reddit-posts">
    <div class="reddit-posts-container">
      {#each showingPosts as post, i}
        <Post {post} />
      {/each}
    </div>
  </section>
</main>
