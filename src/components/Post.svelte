<script>
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";

  export let post;

  function parseTime(time) {
    const s = Math.floor(Date.now() / 1000) - time;
    let toreturn;
    if (s > 3600) {
      const hours = (s / (60 * 60)).toFixed();
      if (hours > 24) {
        const days = Math.floor(hours / 24);
        toreturn = days + "d " + Math.floor((s % (3600 * 24)) / 3600) + "h";
      } else {
        toreturn = hours + "h";
      }
    } else {
      const minutes = (s / 60).toFixed();
      toreturn = minutes + "m";
    }
    return toreturn;
  }

  function shortenNumber(num) {
    return Math.abs(num) > 999
      ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
      : Math.sign(num) * Math.abs(num);
  }

  function parseMarkdown(markdownText) {
    if (markdownText != null) {
      const htmlText = markdownText
        .replace(/^### (.*$)/gim, "$1")
        .replace(/^## (.*$)/gim, "$1")
        .replace(/^# (.*$)/gim, "$1")
        .replace(/^\> (.*$)/gim, "$1")
        .replace(/\*\*(.*)\*\*/gim, "$1")
        .replace(/\*(.*)\*/gim, "$1")
        .replace(/!\[(.*?)\]\((.*?)\)/gim, "$2")
        .replace(/\[(.*?)\]\((.*?)\)/gim, "$1")
        .replace(/\n$/gim, "");
      return htmlText.trim();
    } else {
      return "";
    }
  }
</script>

<style>
  .post {
    z-index: 1;
    height: 5.2em;
    display: flex;
    background-color: white;
    border-radius: 5px;
    cursor: pointer;
    overflow: hidden;
    box-shadow: 0px 1px 4px 1px rgba(88, 88, 88, 0.1);
    transition: 0.4s;
  }

  a:hover {
    text-decoration: none;
  }

  a:visited {
    color: gray;
  }

  .post:hover {
    box-shadow: 0px 2px 5px 3px rgba(88, 88, 88, 0.2);
  }

  .post-info-container {
    min-width: 0;
    position: relative;
  }

  .info {
    word-wrap: break-word;
    padding: 0.8vh 0.8vh;
  }

  .img-container {
    min-width: 140px;
  }

  .img-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .text {
    line-height: 1.2em;
  }

  .post h1 {
    font-size: 0.9em;
    font-weight: 500;
  }

  .p-link {
    padding-top: 0.3em;
    font-size: 0.6em;
    color: grey;
    text-decoration: none;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    height: 2em;
  }

  .p-self {
    padding-top: 0.3em;
    font-size: 0.7em;
    font-weight: 400;
    color: gray;
  }

  .post-details {
    position: absolute;
    display: flex;
    align-items: center;
    bottom: 0;
    background: white;
    width: 100%;
    height: 1.5em;
  }
  .post-details div:first-child {
    padding-left: 0.2vw;
  }
  .post-details div {
    display: flex;
    align-items: center;
    width: 4em;
  }

  .post-details img {
    width: 14px;
    margin-right: 0.2rem;
  }

  .post-details p {
    color: #bfbfbf;
    font-size: 0.8em;
    font-weight: lighter;
    overflow: visible;
    white-space: nowrap;
  }

  @media screen and (max-width: 730px) {
    .img-container {
      display: none;
    }
  }

  @media screen and (max-width: 580px) {
    .img-container {
      display: block;
    }
  }
</style>

<main transition:slide>
  <a href={'https://www.reddit.com' + post.data.permalink} target="_blank">
    <div title={post.data.title} class="post">
      {#if post.data.thumbnail != 'self' && post.data.thumbnail != 'default' && post.data.thumbnail != ''}
        <div class="img-container">
          <img alt="img" src={post.data.thumbnail} />
        </div>
      {/if}
      <div class="post-info-container">
        <div class="info">
          <h1 class="text">{post.data.title}</h1>

          {#if post.data.is_self == false}
            <p class="p-link text">{post.data.url}</p>
          {/if}

          {#if post.data.selftext !== ''}
            <p class="p-self text">{parseMarkdown(post.data.selftext)}</p>
          {/if}
        </div>
        <div class="post-details">
          <div>
            <img alt="Upvotes" src="icons/arrow.svg" />
            <p>{shortenNumber(post.data.ups)}</p>
          </div>
          <div>
            <img alt="Comments" src="icons/comments.svg" />
            <p>{shortenNumber(post.data.num_comments)}</p>
          </div>
          <div>
            <img alt="Time" src="icons/clock.svg" />
            <p>{parseTime(post.data.created_utc)}</p>
          </div>
        </div>
      </div>
    </div>
  </a>
</main>
