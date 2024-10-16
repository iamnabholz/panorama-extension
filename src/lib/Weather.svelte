<script>
  import { onDestroy, onMount } from "svelte";
  import browser from "webextension-polyfill";
  import { weatherCoordinates, settings } from "../stores";
  import LoadingIndicator from "./components/LoadingIndicator.svelte";

  let updatingWeather = false;

  let lastUpdateTime =
    localStorage.getItem("weather-up") != null
      ? JSON.parse(localStorage.getItem("weather-up"))
      : 0;

  let currentResponse =
    localStorage.getItem("weather-resp") != null
      ? JSON.parse(localStorage.getItem("weather-resp"))
      : {};

  $: temperature = currentResponse.cod != null ? currentResponse.main.temp : 20;

  $: description =
    currentResponse.cod != null ? currentResponse.weather[0].main : "Cloud";

  $: iconId =
    currentResponse.cod != null ? currentResponse.weather[0].icon : "02d";

  $: iconLink = "https://openweathermap.org/img/wn/" + iconId + "@2x.png";

  $: location =
    currentResponse.cod != null ? currentResponse.name : "Santa Cruz";

  const getWeather = () => {
    updatingWeather = true;
    browser.runtime
      .sendMessage({
        message: "fetch-weather",
        latitude: $weatherCoordinates.lat,
        longitude: $weatherCoordinates.lon,
      })
      .then((message) => {
        //console.log(message.response);
        if (message.response != null) {
          currentResponse = message.response;

          localStorage.setItem("weather-up", Date.now().toString());
          localStorage.setItem(
            "weather-resp",
            JSON.stringify(message.response),
          );
        }
        updatingWeather = false;
      });
  };

  onMount(() => {
    const d = parseInt(lastUpdateTime) + 3600000;
    if (d < Date.now()) {
      getWeather();
    }
  });

  const unsubscribe = weatherCoordinates.subscribe(() => getWeather());
  onDestroy(unsubscribe);
</script>

<section class="column-wrapper">
  <div class="row-wrapper" style="gap: 1rem; align-items: center">
    <div title={description} class="weather-icon">
      <img src={iconLink} alt={description} />
    </div>

    <div class="column-wrapper weather-info">
      {#if $settings.usingMetric}
        <h1>{Math.floor(temperature)}&deg;C</h1>
      {:else}
        <h1>{Math.floor((temperature * 9) / 5 + 32)}&deg;F</h1>
      {/if}
      <p>{description}</p>
    </div>

    {#if updatingWeather}
      <LoadingIndicator></LoadingIndicator>
    {/if}
  </div>
  <!--<p>{location}</p>-->
</section>

<style>
  section {
    cursor: default;
    gap: 1rem;
    color: var(--light-color);
    text-shadow: var(--text-shadow);
  }

  .weather-icon {
    height: 64px;
    width: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    filter: drop-shadow(var(--image-shadow));
  }

  .weather-info {
    gap: 4px;
    justify-content: center;
  }

  img {
    height: 140%;
    width: 140%;
    object-fit: cover;
  }

  h1 {
    font-size: 2rem;
    font-weight: 600;
    line-height: 1;
  }

  p {
    font-size: 1.4rem;
  }
</style>
