<script>
  import {
    weather,
    latitude,
    longitude,
    search,
    defaultSearch,
    sites,
    reddit,
    background,
    searchBackground,
    backgroundColor
  } from "../stores/options.js";
  import { slide, fade } from "svelte/transition";
  import LoadingIndicator from "../components/LoadingIndicator.svelte";
  import Button from "../components/Button.svelte";
  import Checkbox from "../components/Checkbox.svelte";

  let weatherBind = $weather === "true" ? true : false;
  let searchBind = $search === "true" ? true : false;
  let sitesBind = $sites === "true" ? true : false;
  let redditBind = $reddit === "true" ? true : false;
  let backgroundBind = $background === "true" ? true : false;

  let bgColor = $backgroundColor;

  let currentOption = "";

  let lat = $latitude;
  let lon = $longitude;
  let loadingCoords = false;

  let bgRefresh = true;

  let bgTimer = parseInt(localStorage.getItem("bg-timer")) || 0;

  if (localStorage.getItem("bg-refresh-toggle") !== null) {
    if (localStorage.getItem("bg-refresh-toggle") === "false") {
      bgRefresh = false;
    }
  }
  let bgCategory = $searchBackground;

  function requestCoordinates() {
    const options = {
      enableHighAccuracy: true
    };
    navigator.geolocation.getCurrentPosition(getLocation, getError, options);
  }

  function getLocation(position) {
    lat = position.coords.latitude.toFixed(2);
    lon = position.coords.longitude.toFixed(2);
    loadingCoords = false;
  }

  function getError(error) {
    console.log("Error while getting location from settings page");
    console.log(error);
    loadingCoords = false;
  }

  function setDefaultSearch(engine) {
    defaultSearch.set(engine);
    localStorage.setItem("engine", engine);
  }
</script>

<style>
  .modal-container {
    width: 100%;
    border-radius: 6px;
    overflow: hidden;
    background-color: #f2f2f2;
    color: black;
    box-shadow: 0px 1px 3px 2px rgba(0, 0, 0, 0.08);
  }

  h1 {
    font-size: 1.3em;
  }

  section {
    padding: 0 1rem;
  }

  .header {
    padding: 1rem;
    background-color: white;
  }

  a:visited {
    color: rgb(0, 100, 200);
  }

  .option {
    display: flex;
    padding: 1em 1em;
    align-items: center;
    border-top: 1px solid rgba(180, 180, 180, 0.3);
    width: 100%;
    height: 72px;
    background-color: white;
  }

  .option h1 {
    padding-left: 0.4em;
  }

  .explanation {
    font-size: 0.9em;
    margin-bottom: 0.8rem;
    line-height: 1.2;
  }

  .options-content {
    padding: 0.6rem 1rem;
    display: flex;
    flex-direction: column;
  }

  .position-selector .text {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .text {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0.4rem 0;
  }

  .position-buttons {
    align-self: flex-end;
    display: flex;
    align-items: center;
  }

  .open {
    transform: rotateZ(180deg) !important;
  }

  .search-engines {
    padding-top: 0.4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .search-engines div {
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 4rem;
    height: 4.4rem;
    padding: 0.4rem 0;
    text-overflow: ellipsis;
    cursor: pointer;
    flex: 1 1 0;
  }

  .search-engines p {
    font-size: 0.8rem;
  }

  .search-engines img {
    height: 36px;
    width: 36px;
  }

  .selected-engine {
    cursor: default;
    border: none;
    background-color: rgba(0, 130, 243, 1);
    color: white;
  }

  input[type="text"] {
    outline: none;
    border: 3px solid transparent;
    border-radius: 4px;
    box-sizing: content-box;
  }

  input[type="text"]:focus {
    border-color: rgba(0, 130, 243, 1);
  }

  .colors-showcase {
    display: grid;
    column-gap: 0.3rem;
    grid-template-columns: repeat(3, auto);
    padding-top: 0.5rem;
    height: 40px;
  }

  .color {
    width: 100%;
    height: 100%;
    border-radius: 3px;
    border: 4px solid lightgray;
    box-sizing: border-box;
    cursor: pointer;
  }

  .selected-color {
    cursor: default;
    border-color: rgba(0, 130, 243, 1);
  }

  .color-text-input {
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }

  .color-text-input input[type="text"] {
    margin-left: 45px;
    border-radius: 0;
    width: 7em;
  }

  .color-text-input input[type="text"]:focus {
    border-color: var(--color);
  }

  .color-preview {
    position: absolute;
    left: 0;
    height: 100%;
    width: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }

  .color-preview p {
    font-size: 2em;
    color: white;
    mix-blend-mode: difference;
  }

  .information-links {
    display: flex;
    font-size: 0.86rem;
    align-items: center;
    justify-content: space-between;
  }

  .information-links p {
    font-size: 1rem;
  }

  @media (prefers-color-scheme: dark) {
    .modal-container {
      background-color: #333;
      color: white;
    }

    .option,
    .header {
      background-color: rgb(24, 24, 24);
    }
  }
</style>

<div class="modal-container">
  <div class="header">
    <h2 style="font-size: 1.1em; font-weight: 500;">Options</h2>
  </div>

  <div>
    <div class="option">
      <Checkbox
        checkboxValue={weatherBind}
        checkboxAction={() => {
          if (weatherBind === true) {
            weatherBind = false;
            weather.set('false');
          } else {
            weatherBind = true;
            weather.set('true');
          }
        }}>
        <h1>Weather</h1>
      </Checkbox>

      <div style="margin-left: auto;">
        <Button
          arrowButton={true}
          disableButton={!weatherBind}
          buttonAction={() => {
            if (currentOption != 'weather') {
              currentOption = 'weather';
            } else {
              currentOption = '';
            }
          }}>
          <img
            style="width: 22px;"
            class:open={currentOption === 'weather' && weatherBind}
            src="icons/chevron-down.svg"
            alt="Left Arrow" />
        </Button>
      </div>
    </div>
    {#if currentOption === 'weather' && weatherBind}
      <section transition:slide class="options-content">
        <p class="explanation">
          Click the °C (or °F) to the side of the temperature to switch between
          units.
        </p>

        <p class="explanation">
          Check that your coordinates are correct to get the most accurate
          weather data.
        </p>
        <div class="position-selector">
          <div class="text">
            <label for="lat">Latitude:</label>
            <input bind:value={lat} type="text" />
          </div>
          <div class="text">
            <label for="lon">Longitude:</label>
            <input bind:value={lon} type="text" />
          </div>
        </div>
        <div class="position-buttons">
          {#if loadingCoords}
            <div transition:fade style="margin-right: 10px;">
              <LoadingIndicator />
            </div>
          {/if}
          <Button
            disableButton={loadingCoords}
            buttonAction={() => {
              loadingCoords = true;
              requestCoordinates();
            }}>
            Get
          </Button>
          <div style="width: 0.2rem;" />
          <Button
            disableButton={lat === $latitude && lon === $longitude}
            buttonAction={() => {
              latitude.set(lat);
              longitude.set(lon);
            }}>
            Save
          </Button>
        </div>
      </section>
    {/if}
  </div>

  <div>
    <div class="option">
      <Checkbox
        checkboxValue={searchBind}
        checkboxAction={() => {
          if (searchBind === true) {
            searchBind = false;
            search.set('false');
          } else {
            searchBind = true;
            search.set('true');
          }
        }}>
        <h1>Search Bar</h1>
      </Checkbox>
      <div style="margin-left: auto;">
        <Button
          arrowButton={true}
          disableButton={!searchBind}
          buttonAction={() => {
            if (currentOption != 'search') {
              currentOption = 'search';
            } else {
              currentOption = '';
            }
          }}>
          <img
            style="width: 22px;"
            class:open={currentOption === 'search' && searchBind}
            src="icons/chevron-down.svg"
            alt="Left Arrow" />
        </Button>
      </div>
    </div>
    {#if currentOption === 'search' && searchBind}
      <section transition:slide class="options-content">
        <p>Default Search Engine:</p>

        <div class="search-engines">
          <div
            class:selected-engine={$defaultSearch === 'g'}
            on:click={() => {
              setDefaultSearch('g');
            }}>
            <img alt="Google Logo" src="/icons/google-ico.png" />
            <p>Google</p>
          </div>
          <div
            class:selected-engine={$defaultSearch === 'd'}
            on:click={() => {
              setDefaultSearch('d');
            }}>
            <img alt="Google Logo" src="/icons/duckduckgo-ico.png" />
            <p>DuckDuckGo</p>
          </div>
          <div
            class:selected-engine={$defaultSearch === 'e'}
            on:click={() => {
              setDefaultSearch('e');
            }}>
            <img alt="Google Logo" src="/icons/ecosia-ico.png" />
            <p>Ecosia</p>
          </div>
          <div
            class:selected-engine={$defaultSearch === 'w'}
            on:click={() => {
              setDefaultSearch('w');
            }}>
            <img alt="Google Logo" src="/icons/wikipedia-ico.png" />
            <p>Wikipedia</p>
          </div>
        </div>
      </section>
    {/if}
  </div>

  <div class="option">
    <Checkbox
      checkboxValue={sitesBind}
      checkboxAction={() => {
        if (sitesBind === true) {
          sitesBind = false;
          sites.set('false');
        } else {
          sitesBind = true;
          sites.set('true');
        }
      }}>
      <h1>Top Sites</h1>
    </Checkbox>
  </div>

  <div class="option">
    <Checkbox
      checkboxValue={redditBind}
      checkboxAction={() => {
        if (redditBind === true) {
          redditBind = false;
          reddit.set('false');
        } else {
          redditBind = true;
          reddit.set('true');
        }
      }}>
      <h1>Reddit Posts</h1>
    </Checkbox>
  </div>

  <div>
    <div class="option">
      <h1>Background</h1>
      <div style="margin-left: auto;">
        <Button
          arrowButton={true}
          disableButton={false}
          buttonAction={() => {
            if (currentOption != 'background') {
              currentOption = 'background';
            } else {
              currentOption = '';
            }
          }}>
          <img
            style="width: 22px;"
            class:open={currentOption === 'background'}
            src="icons/chevron-down.svg"
            alt="Left Arrow" />
        </Button>
      </div>
    </div>

    {#if currentOption === 'background'}
      <section transition:slide class="options-content">
        <Checkbox
          checkboxValue={backgroundBind}
          checkboxAction={() => {
            if (backgroundBind === true) {
              backgroundBind = false;
              background.set('false');
            } else {
              backgroundBind = true;
              background.set('true');
            }
          }}>
          Background Images
        </Checkbox>
        {#if backgroundBind}
          <div
            transition:slide|local
            style="display: flex; flex-direction: column;">
            <Checkbox
              checkboxValue={bgRefresh}
              checkboxAction={() => {
                if (bgRefresh === true) {
                  bgRefresh = false;
                  localStorage.setItem('bg-refresh-toggle', 'false');
                } else {
                  bgRefresh = true;
                  localStorage.setItem('bg-refresh-toggle', 'true');
                }
              }}>
              Refresh background images hourly
            </Checkbox>
            <div class="text" style="padding-top: 0.4rem;">
              <label for="cat">Category:</label>
              <input name="cat" bind:value={bgCategory} type="text" />
            </div>
            <div style="align-self: flex-end;">
              <Button
                disableButton={bgCategory === $searchBackground}
                buttonAction={() => {
                  searchBackground.set(bgCategory);
                }}>
                Save
              </Button>
            </div>
            {#if !bgRefresh && bgTimer + 6600000 < Date.now()}
              <div transition:slide|local class="text">
                <p>Refresh Background Now</p>
                <Button
                  disableButton={false}
                  buttonAction={() => {
                    bgTimer = Date.now();
                    let ref = $searchBackground;
                    searchBackground.set('ni');
                    searchBackground.set(ref);
                  }}>
                  Refresh
                </Button>
              </div>
            {/if}
          </div>
        {:else}
          <div
            transition:slide|local
            style="display: flex; flex-direction: column; padding-top: 0.4rem;">
            <p>Select a background color</p>
            <div class="colors-showcase">
              <div
                class:selected-color={bgColor === 'f2f2f2'}
                on:click={() => {
                  bgColor = 'f2f2f2';
                }}
                class="color"
                style="background-color: #f2f2f2;" />
              <div
                class:selected-color={bgColor === '181818'}
                on:click={() => {
                  bgColor = '181818';
                }}
                class="color"
                style="background-color: #181818;" />
              <div
                class:selected-color={bgColor === 'd7be69'}
                on:click={() => {
                  bgColor = 'd7be69';
                }}
                class="color"
                style="background-color: #d7be69;" />
            </div>

            <div class="text" style="padding-top: 0.4rem;">
              <label for="color">HEX Color Code:</label>
              <div class="color-text-input">
                <div class="color-preview" style="background-color: #{bgColor}">
                  <p>#</p>
                </div>
                <input
                  style="--color: #{bgColor}"
                  name="color"
                  maxlength="6"
                  minlength="3"
                  bind:value={bgColor}
                  type="text" />

              </div>
            </div>
            <div style="align-self: flex-end;">
              <Button
                disableButton={bgColor === $backgroundColor}
                buttonAction={() => {
                  backgroundColor.set(bgColor);
                  localStorage.setItem('bg-color', bgColor);
                }}>
                Save
              </Button>
            </div>
          </div>
        {/if}
      </section>
    {/if}
  </div>

  <div>
    <div class="option">
      <h1>About</h1>
      <div style="margin-left: auto;">
        <Button
          arrowButton={true}
          buttonAction={() => {
            if (currentOption != 'about') {
              currentOption = 'about';
            } else {
              currentOption = '';
            }
          }}>
          <img
            style="width: 22px;"
            class:open={currentOption === 'about'}
            src="icons/chevron-down.svg"
            alt="Left Arrow" />
        </Button>
      </div>
    </div>

    {#if currentOption === 'about'}
      <section transition:slide class="options-content">
        <div
          class="information-links"
          style="flex-direction: column; margin: 0.6rem 0 1rem 0;">
          <p>Panorama Tab v1.1.0</p>
          <a
            style="margin: 0.56rem 0;"
            href="https://panoramatab.netlify.app/privacy%20policy.html"
            target="_blank">
            Privacy Policy &#8599;&#xFE0E;
          </a>
          <a href="mailto:support@nabholz.work?subject=Panorama Tab">
            support@nabholz.work &#128231;&#xFE0E;
          </a>
        </div>

        <div class="information-links">
          <span style="margin-top: 0.3rem;">
            by
            <a href="https://nabholz.work/" target="_blank">
              nabholz.work &#8599;&#xFE0E;
            </a>
          </span>

          <a
            class="kofi-button"
            href="https://ko-fi.com/Z8Z82TKAA"
            target="_blank">
            <img
              height="36"
              style="border:0px;height:36px;"
              src="/icons/kofi3.png"
              border="0"
              alt="Buy Me a Coffee at ko-fi.com" />
          </a>
        </div>
      </section>
    {/if}
  </div>
</div>
