<script>
  import { onMount } from "svelte";

  const now = new Date();

  let holidays =
    localStorage.getItem("holidayy") != null
      ? JSON.parse(localStorage.getItem("holidayy"))
      : {};

  const getHolidays = async () => {
    let holidays = await fetch("https://holiday-grab.nabholz.workers.dev/");

    const json = await holidays.json();
    holidays = json;
    localStorage.setItem("holidayy", JSON.stringify(json));
  };

  onMount(() => {
    if (localStorage.getItem("holidayy") === null) {
      getHolidays();
    } else {
      if (holidays[0].year !== now.getFullYear()) {
        console.log("getting new holidays");
        getHolidays();
      }
    }
  });
</script>

<p>
  {now.toLocaleDateString("default", {
    weekday: "long",
    day: "numeric",
    month: "short",
  })}
</p>

{#each holidays as today}
  {#if today.date === now}
    <p style="padding-top: 8px;"><b>{today.name}</b></p>
  {/if}
{/each}

<style>
  p {
    cursor: default;
    font-size: 1.4rem;
    color: var(--light-color);
    text-shadow: var(--text-shadow);
  }
</style>
