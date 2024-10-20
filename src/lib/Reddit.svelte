<script>
  import { onDestroy, onMount } from "svelte";
  import { subredditList } from "../stores";
  import { checkTimerDone, getColorForSubreddit } from "../utils";
  import LoadingIndicator from "./components/LoadingIndicator.svelte";

  let isLoadingPosts = false;

  let postsContainerElement;

  const scrollPostsToTop = () => {
    postsContainerElement.scrollTo({ top: 0, behavior: "smooth" });
  };

  let allPosts =
    localStorage.getItem("reddit-posts") != null
      ? JSON.parse(localStorage.getItem("reddit-posts"))
      : [];

  async function getPosts(subreddit) {
    let feed = await fetch(
      "https://www.reddit.com/r/" + subreddit + "/" + "hot" + ".json?limit=60",
    );

    const json = await feed.json();

    if (json.data != null) {
      let data = json.data.children;
      let filtered = data.filter((el) => el.data.stickied != true);

      filtered = filtered.slice(0, 50);

      return filtered;
    } else {
      console.log("There was an error fetching information from the subreddit");

      return [];
    }
  }

  async function fetchEverything() {
    isLoadingPosts = true;
    const postsBySubreddit = [];

    // Use map to create an array of promises returned by getPosts for each subreddit
    const fetchPromises = $subredditList.map(async (sub, index) => {
      const posts = await getPosts(sub);
      // Create a separate array for each subreddit's posts
      postsBySubreddit[index] = [...posts];
    });

    // Wait for all fetchPromises to complete
    await Promise.all(fetchPromises);

    let maxLength = Math.max(
      ...postsBySubreddit.map((subPosts) => subPosts.length),
    );

    allPosts = [];
    // Loop up to the length of the longest subreddit post array
    for (let i = 0; i < maxLength; i++) {
      postsBySubreddit.forEach((subPosts) => {
        if (subPosts[i]) {
          allPosts.push(subPosts[i]);
        }
      });
    }
    allPosts = allPosts.slice(0, 100);
    localStorage.setItem("reddit-posts", JSON.stringify(allPosts));
    localStorage.setItem("reddit-up", Date.now().toString());
    isLoadingPosts = false;
    scrollPostsToTop();
  }

  let lastUpdateTime =
    localStorage.getItem("reddit-up") != null
      ? JSON.parse(localStorage.getItem("reddit-up"))
      : 0;

  const checkThumbnailSource = (source) => {
    try {
      return new URL(source);
    } catch {
      return false;
    }
  };

  onMount(() => {
    if (checkTimerDone(lastUpdateTime, 0.5) || allPosts == []) {
      fetchEverything();
    }
  });

  const unsubscribe = subredditList.subscribe(() => fetchEverything());

  onDestroy(unsubscribe);
</script>

<section>
  <div bind:this={postsContainerElement} class="reddit-posts">
    {#each allPosts as post, i}
      <a
        href={"https://www.reddit.com" + post.data.permalink}
        target="_blank"
        title={post.data.title}
      >
        <div class="post">
          <div class="text-container">
            <p
              style="color: {getColorForSubreddit(post.data.subreddit)}"
              class="subreddit"
            >
              r/{post.data.subreddit}
            </p>
            <!--<p class="title">{post.data.title}</p>-->

            <a
              href={"https://www.reddit.com" + post.data.permalink}
              target="_blank"
              title={post.data.title}
              class="title"
            >
              {post.data.title}
            </a>
          </div>
          {#if checkThumbnailSource(post.data.thumbnail)}
            <div class="thumbnail-container">
              <img alt="Post thumbnail" src={post.data.thumbnail} />
            </div>
          {/if}
        </div>
      </a>
    {/each}
  </div>

  {#if isLoadingPosts}
    <div class="column-wrapper loading-information">
      <LoadingIndicator></LoadingIndicator>
      <p>Loading new information...</p>
    </div>
  {/if}
</section>

<style>
  section {
    position: relative;
    width: 480px;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-right: 18px;

    color: var(--text-color);
  }

  .reddit-posts {
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow-y: scroll;
    overflow-x: unset;
    padding: 0 18px;
    margin: 0 -18px;
  }

  .post {
    cursor: pointer;
    padding: 8px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    color: var(--text-color);
    background-color: var(--background-color);
    border-radius: 6px;

    transition: all 350ms ease-out;
  }

  .post:hover .thumbnail-container img {
    transform: scale(1.06);
  }

  .text-container {
    padding: 4px 8px 4px 4px;
  }

  .subreddit {
    color: white;
    font-size: 14px;
    font-weight: bold;
    padding-bottom: 4px;
    line-height: 1;
  }

  .title {
    line-height: 1.2;
  }

  .thumbnail-container {
    flex-shrink: 0;
    width: 96px;
    height: 96px;
    border-radius: 6px;
    overflow: hidden;
    align-self: center;
    background-color: grey;
  }

  .thumbnail-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 500ms ease-out;
  }

  .loading-information {
    position: absolute;
    text-align: center;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: var(--light-color);
    text-shadow: var(--text-shadow);
  }

  a:hover {
    text-decoration: none;
  }

  a:visited .post {
    background-color: var(--lighter-color);
  }

  @media screen and (max-width: 680px) {
    section {
      width: 100%;
      padding-right: 0;
      margin-right: 0;
    }

    .reddit-posts {
      padding-bottom: 6rem;
      overflow-y: visible;
    }
  }

  @media (prefers-color-scheme: dark) {
    .post {
      background-color: var(--darker-color);
    }

    a:visited .post {
      background-color: var(--dark-color);
    }
  }
</style>
