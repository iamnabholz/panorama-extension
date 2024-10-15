<script>
    import { onDestroy, onMount } from "svelte";
    import { subredditList } from "../stores";
    import { getColorForSubreddit } from "../utils";
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
            "https://www.reddit.com/r/" +
                subreddit +
                "/" +
                "hot" +
                ".json?limit=60",
        );

        const json = await feed.json();

        if (json.data != null) {
            let data = json.data.children;
            let filtered = data.filter((el) => el.data.stickied != true);

            filtered = filtered.slice(0, 50);

            return filtered;
        } else {
            console.log(
                "There was an error fetching information from the subreddit",
            );

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
        isLoadingPosts = false;
        scrollPostsToTop();
    }

    onMount(() => {
        fetchEverything();
    });

    const unsubscribe = subredditList.subscribe(() => {
        fetchEverything();
    });

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
                            style="color: {getColorForSubreddit(
                                post.data.subreddit,
                            )}"
                            class="subreddit"
                        >
                            r/{post.data.subreddit}
                        </p>
                        <p class="title">{post.data.title}</p>
                    </div>
                    {#if post.data.thumbnail != "self" && post.data.thumbnail != "default" && post.data.thumbnail != ""}
                        <div class="thumbnail-container">
                            <img
                                alt="Post thumbnail"
                                src={post.data.thumbnail}
                            />
                        </div>
                    {/if}
                </div>
            </a>
        {/each}
    </div>

    {#if isLoadingPosts}
        <div class="column-wrapper loading-information">
            <LoadingIndicator></LoadingIndicator>
            <p>Loading new data...</p>
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
        margin-right: -18px;

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
        width: 100%;
        color: var(--text-color);
        background-color: var(--background-color);
        border-radius: 6px;
        box-shadow: 0px 1px 4px 1px rgba(88, 88, 88, 0.1);

        transition: all 350ms ease-out;

        min-height: 4rem;
    }

    .post:hover .thumbnail-container img {
        transform: scale(1.1);
    }

    .text-container {
        flex-grow: 1;
        padding: 0 0 4px 4px;
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
        overflow: hidden;
        text-overflow: ellipsis;
        max-height: 4.2rem;
    }

    .thumbnail-container {
        margin-left: 18px;
        flex-shrink: 0;
        width: 96px;
        height: 96px;
        border-radius: 8px;
        overflow: hidden;
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

    @media screen and (max-width: 680px) {
        section {
            width: 100%;
        }

        .reddit-posts {
            overflow-y: visible;
        }
    }

    a:hover {
        text-decoration: none;
    }

    @media (prefers-color-scheme: dark) {
        .post {
            background-color: var(--darker-color);
        }
    }
</style>
