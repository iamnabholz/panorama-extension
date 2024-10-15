<script>
  const now = new Date();
</script>

<p>
  {now.toLocaleDateString("default", {
    weekday: "long",
    day: "numeric",
    month: "short",
  })}
</p>

<style>
  p {
    color: var(--light-color);
    text-shadow: var(--text-shadow);
  }
</style>
