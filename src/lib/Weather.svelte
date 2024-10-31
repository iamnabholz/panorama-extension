<script>
  import {onDestroy, onMount} from "svelte";
  import browser from "webextension-polyfill";
  import {weatherCoordinates, settings} from "../stores";
  import LoadingIndicator from "./components/LoadingIndicator.svelte";
  import {checkTimerDone} from "../utils";

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

  const weatherIconMap = {
    sun: "01d",
    moon: "01n",
    clouds: ["02d", "02n", "03d", "03n", "04d", "04n"],
    rain: ["09d", "09n", "10d", "10n"],
    thunder: ["11d", "11n"],
    mist: ["09d", "09n"],
    snow: ["13d", "13n"],
  };
  const getWeatherIcon = (apiIcon) => {
    // FOR TESTING PURPOSES
    return "thunder";

    for (let icon in weatherIconMap) {
      if (weatherIconMap[icon].includes(apiIcon)) {
        return icon;
      }
    }
    return "clouds";
  };

  //$: iconLink = getWeatherIcon(iconId);

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
    if (checkTimerDone(lastUpdateTime)) {
      getWeather();
    }
  });

  const unsubscribe = weatherCoordinates.subscribe(() => getWeather());
  onDestroy(unsubscribe);
</script>

<section class="row-wrapper" style="gap: 1rem; align-items: center">
  <div title={description} class="weather-icon">
    <!--
    <img src={"icons/weather/" + iconLink + ".svg"} alt={description}/>
    -->
    <img src={iconLink} alt={description}/>
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
</section>

<style>
  section {
    cursor: default;
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
    gap: 0px;
    justify-content: center;
  }

  img {
    height: 140%;
    width: 140%;
    object-fit: cover;
  }

  h1 {
    font-size: 2.2rem;
    font-weight: 600;
    line-height: 1;
  }

  p {
    font-size: 1.4rem;
  }
</style>
