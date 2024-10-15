<div title="Loading information..." class="loading"></div>

<style>
  .loading {
    --size: 20px;
    box-sizing: border-box;
    height: var(--size);
    width: var(--size);
    border-radius: 50%;
    border-color: var(--background-color) var(--text-color) var(--text-color)
      var(--text-color);
    border-width: 4px;
    border-style: solid;
    border-image: initial;
    animation: 0.75s linear 0s infinite normal none running rotate;
    cursor: default;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
