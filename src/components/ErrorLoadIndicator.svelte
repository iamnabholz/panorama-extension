<script>
  export let size = 16;
  export let color = "white";
  export let unit = "px";
</script>

<style>
  :root {
    --error-color: #eb413d;
    --warning-color: orange;
  }
  .circle {
    --size: 20px;
    box-sizing: border-box;
    height: var(--size);
    width: var(--size);
    border-radius: 50%;
    cursor: default;
  }

  .error {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--error-color);
    font-weight: lighter;
  }
</style>

<div title="There's a problem loading the information" class="circle error">
  !
</div>
