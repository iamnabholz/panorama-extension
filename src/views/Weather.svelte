<script>
  import { onMount } from "svelte";
  import { weatherDefault } from "../stores/weather.js";

  let unit = localStorage.getItem("unit") || "c";

  let permission =
    localStorage.getItem("perm") != null ? localStorage.getItem("perm") : false;

  $: time =
    localStorage.getItem("wooo") != null ? localStorage.getItem("wooo") : 0;

  let weatherResponse =
    localStorage.getItem("weee") != null
      ? JSON.parse(localStorage.getItem("weee"))
      : JSON.parse(weatherDefault);

  $: iconId = weatherResponse.current.weather[0].icon;
  $: iconLink = "http://openweathermap.org/img/wn/" + iconId + "@2x.png";

  $: text = weatherResponse.current.weather[0].description;

  $: temp = weatherResponse.current.temp;
  $: value = getTemp(temp);

  let lat = localStorage.getItem("lattitude") || weatherResponse.lat;

  let lon = localStorage.getItem("longitude") || weatherResponse.lon;

  const options = {
    enableHighAccuracy: true
  };

  onMount(() => {
    let d = parseInt(time) + 3600000;
    if (permission && d < Date.now()) {
      getWeather();
    }
  });

  function ask() {
    navigator.geolocation.getCurrentPosition(getLocation, getError, options);
  }

  function getLocation(position) {
    if (permission == false) {
      localStorage.setItem("perm", true);
      permission = true;
    }

    lat = position.coords.latitude;
    lon = position.coords.longitude;

    localStorage.setItem("lattitude", position.coords.latitude);
    localStorage.setItem("longitude", position.coords.longitude);

    getWeather();
  }

  function getError(error) {
    console.log(error);
  }

  async function getWeather() {
    const result = await fetch(
      "https://get-weather.nabholz.workers.dev/?lat=" + lat + "&lon=" + lon
    );
    const json = await result.json();

    weatherResponse = json;
    localStorage.setItem("weee", JSON.stringify(json));
    localStorage.setItem("wooo", Date.now());
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
</script>

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

  .reverse {
    flex-direction: row-reverse;
  }

  .hide {
    display: none;
  }
</style>

<main>
  {#if permission}
    <div title="Current Weather" class="weather">
      <div class="icon-weather">
        <img
          title={text.charAt(0).toUpperCase() + text.slice(1)}
          alt={text}
          src={iconLink} />
      </div>

      <div class="text-weather">
        <h1>{value}</h1>

        <div
          title="Switch Temperature Unit"
          class:reverse={unit == 'f'}
          class="text-temperature"
          on:click={() => {
            if (unit == 'c') {
              unit = 'f';
            } else {
              unit = 'c';
            }
            localStorage.setItem('unit', unit);
            value = getTemp(temp);
          }}>

          <p class:hide={unit == 'f'}>°C</p>
          <p class:hide={unit == 'c'}>°F</p>
        </div>
      </div>

    </div>
  {:else}
    <p
      on:click|once={() => {
        ask();
      }}>
      Set Up Weather Location
    </p>
  {/if}

</main>
