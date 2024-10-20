<script>
  import { onMount } from "svelte";

  const now = new Date();

  const formattedDate =
    now.getFullYear() +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(now.getDate()).padStart(2, "0");

  let holidays =
    localStorage.getItem("holidayy") != null
      ? JSON.parse(localStorage.getItem("holidayy"))
      : {};

  const getHolidays = async () => {
    try {
      const data = await fetch("https://holiday-grab.nabholz.workers.dev/");
      const json = await data.json();
      holidays = json;
      localStorage.setItem("holidayy", JSON.stringify(json));
    } catch (error) {
      console.error("Failed to fetch holidays:", error);
    }
  };

  onMount(() => {
    if (localStorage.getItem("holidayy") === null) {
      //console.log("HOLIDAYS ARE DISABLED IN THE COMPONENT");
      getHolidays();
    } else {
      if (holidays[0].year !== now.getFullYear()) {
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

{#if holidays.length > 0}
  {#each holidays as today}
    {#if today.date === formattedDate}
      <p class="local-holiday">{today.name}</p>
    {/if}
  {/each}
{/if}

<style>
  p {
    cursor: default;
    font-size: 1.4rem;
    color: var(--light-color);
    text-shadow: var(--text-shadow);
  }

  .local-holiday {
    font-kerning: normal;
    font-weight: 600;
    padding-top: 6px;
  }
</style>
