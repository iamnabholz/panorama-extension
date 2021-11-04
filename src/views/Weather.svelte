<script>
  import { onMount, onDestroy } from "svelte";
  import { fade, slide } from "svelte/transition";
  import { weatherDefault } from "../stores/weather.js";
  import { latitude, longitude } from "../stores/options.js";

  import LoadingIndicator from "../components/LoadingIndicator.svelte";
  import ErrorLoadIndicator from "../components/ErrorLoadIndicator.svelte";

  let unit = localStorage.getItem("unit") || "c";

  let permission =
    localStorage.getItem("perm") != null ? localStorage.getItem("perm") : false;

  let time =
    localStorage.getItem("weather-timer") != null
      ? localStorage.getItem("weather-timer")
      : 0;

  let weatherResponse =
    localStorage.getItem("weather") != null
      ? JSON.parse(localStorage.getItem("weather"))
      : JSON.parse(weatherDefault);

  $: iconId = weatherResponse.current.weather[0].icon;
  $: iconLink = "http://openweathermap.org/img/wn/" + iconId + "@2x.png";

  $: text = weatherResponse.current.weather[0].description;

  $: temp = weatherResponse.current.temp;
  $: value = getTemp(temp);

  let lat = $latitude || weatherResponse.lat;
  let lon = $longitude || weatherResponse.lon;

  let loadingInfo = false;
  let errorLoading = false;

  let hovering = false;

  const options = {
    enableHighAccuracy: true,
  };

  onMount(() => {
    let d = parseInt(time) + 3600000;
    if (permission && d < Date.now()) {
      getWeather();
    }
  });

  function ask() {
    asking = true;
    navigator.geolocation.getCurrentPosition(getLocation, getError, options);
  }

  let asking = false;

  function getLocation(position) {
    if (permission == false) {
      permission = true;
      localStorage.setItem("perm", true);
    }

    latitude.set(position.coords.latitude);
    longitude.set(position.coords.longitude);

    getWeather();

    asking = false;
  }

  function getError(error) {
    console.log(error);
    asking = false;
    errorLoading = true;
  }

  async function getWeather() {
    loadingInfo = true;
    const response = await fetch(
      "https://get-weather.nabholz.workers.dev/?lat=" + lat + "&lon=" + lon
    );

    if ((await response.status) === 200) {
      const json = await response.json();

      weatherResponse = json;
      localStorage.setItem("weather", JSON.stringify(json));
      localStorage.setItem("weather-timer", Date.now());

      loadingInfo = false;
    } else {
      loadingInfo = false;
      errorLoading = true;

      console.log("Problem getting a weather information");
      console.log(response);
    }
  }

  function getTemp(num) {
    let toreturn;
    if (unit == "f") {
      toreturn = (parseInt(num) * 9) / 5 + 32;
      //toreturn = Math.round(toreturn * 10) / 10;
    } else {
      toreturn = parseInt(num);
    }
    return toreturn;
  }

  const unsubscribe = latitude.subscribe((value) => {
    if (lat !== value || lon !== $longitude) {
      lat = value;
      lon = $longitude;
      getWeather();
    }
  });

  onDestroy(unsubscribe);
</script>

<main>
  {#if permission}
    <div title="Current Weather" class="weather">
      <div class="icon-weather">
        <img
          title={text.charAt(0).toUpperCase() + text.slice(1)}
          alt={text}
          src={iconLink}
        />
      </div>

      <div class="text-weather">
        <h1>{value}</h1>

        <div
          title="Switch Temperature Unit"
          class:reverse={unit == "f"}
          class="text-temperature"
          on:click={() => {
            if (unit == "c") {
              unit = "f";
            } else {
              unit = "c";
            }
            localStorage.setItem("unit", unit);
            value = getTemp(temp);
          }}
        >
          <p class:hide={unit == "f"}>°C</p>
          <p class:hide={unit == "c"}>°F</p>
        </div>
      </div>

      {#if loadingInfo}
        <div transition:fade style="margin-left: 10px;">
          <LoadingIndicator />
        </div>
      {/if}

      {#if errorLoading}
        <div transition:fade style="margin-left: 10px;">
          <ErrorLoadIndicator />
        </div>
      {/if}
    </div>
  {:else}
    <div
      class="setup-container"
      on:mouseenter={() => {
        hovering = true;
      }}
      on:mouseleave={() => {
        hovering = false;
      }}
      on:click|once={() => {
        ask();
      }}
    >
      <div style="display: flex; align-items: center;">
        <h3 style="font-weight: 400; height: 36px; line-height: 2;">
          Weather Location
        </h3>

        {#if !asking && !errorLoading}
          <div class="get-button">></div>
        {/if}

        {#if asking}
          <div transition:fade|local style="margin-left: 10px;">
            <LoadingIndicator />
          </div>
        {/if}

        {#if errorLoading}
          <div transition:fade|local style="margin-left: 10px;">
            <ErrorLoadIndicator />
          </div>
        {/if}
      </div>

      {#if hovering}
        <p
          transition:slide|local
          style="font-size: 0.9em; text-align: left; opacity: 0.8;"
        >
          Click to get coordinates from the browser
          <br />
          or you can set them from the options menu.
        </p>
      {/if}
    </div>
  {/if}
</main>

<style>
  main {
    cursor: default;
    width: 100%;
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  p {
    text-align: center;
    font-size: 1em;
  }

  h1 {
    font-size: 2.2em;
  }

  h3 {
    font-size: 1.2em;
  }

  .weather {
    display: flex;
    align-items: center;
  }

  .icon-weather {
    width: 84px;
    height: 84px;
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.28));
  }

  main img {
    width: 84px;
    height: 84px;
  }

  .text-weather {
    display: flex;
    align-items: flex-start;
    text-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  }

  .text-temperature {
    padding-left: 0.2em;
    cursor: pointer;
    display: flex;
  }

  .text-temperature p {
    font-size: 1.2em;
    letter-spacing: 0.06em;
  }

  .setup-container {
    cursor: pointer;
    mix-blend-mode: difference;
  }

  .get-button {
    margin-left: 10px;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    color: black;
  }

  .reverse {
    flex-direction: row-reverse;
  }

  .hide {
    display: none;
  }
</style>
