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
    padding-bottom: 0.8rem;
    line-height: 1.1;
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
    display: flex;
    padding: 0.3rem 0;
  }

  .color {
    width: 34px;
    height: 34px;
    margin-right: 0.3rem;
    border-radius: 3px;
    border: 4px solid lightgray;
    box-sizing: border-box;
    flex: 1 1 0px;
    cursor: pointer;
  }

  .selected-color {
    cursor: default;
    border-color: rgba(0, 130, 243, 1);
  }

  .information {
    border-top: 1px solid rgba(180, 180, 180, 0.3);
    background-color: white;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .information-links {
    display: flex;
    flex-direction: column;
    font-size: 0.86rem;
  }

  @media (prefers-color-scheme: dark) {
    .modal-container {
      background-color: #333;
      color: white;
    }

    .option,
    .information,
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
          Coordinates sometimes can be off by a small margin and as a result you
          get wrong information, check that they're correct for your location.
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
              <input bind:value={bgCategory} type="text" />
            </div>
            <div style="align-self: flex-end;">
              <Button
                disableButton={bgCategory === $searchBackground}
                buttonAction={() => {
                  searchBackground.set(bgCategory);
                  localStorage.setItem('bg-timer', 0);
                }}>
                Save
              </Button>
            </div>
          </div>
        {:else}
          <div
            transition:slide|local
            style="display: flex; flex-direction: column; padding-top: 0.4rem;">
            <p>Select a background color</p>
            <div class="colors-showcase">
              <div
                class:selected-color={bgColor === '#f2f2f2'}
                on:click={() => {
                  bgColor = '#f2f2f2';
                }}
                class="color"
                style="background-color: #f2f2f2;" />
              <div
                class:selected-color={bgColor === '#333'}
                on:click={() => {
                  bgColor = '#333';
                }}
                class="color"
                style="background-color: #333;" />
              <div
                class:selected-color={bgColor === '#d7be69'}
                on:click={() => {
                  bgColor = '#d7be69';
                }}
                class="color"
                style="background-color: #d7be69;" />
            </div>

            <div class="text" style="padding-top: 0.4rem;">
              <label for="cat">HEX Color Code:</label>
              <input
                maxlength="7"
                minlength="4"
                bind:value={bgColor}
                type="text" />
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

  <div class="information">
    <div class="information-links">
      <p style="color: grey;">Panorama Tab v1.0.3</p>
      <a
        style="margin: 0.4rem 0; "
        href="https://panoramatab.netlify.app/privacy%20policy.html"
        target="_blank">
        Privacy Policy
      </a>
      <span>
        <a href="https://nabholz.work/" target="_blank">
          nabholz.work &#8599;&#xFE0E;
        </a>
      </span>
    </div>
    <a class="kofi-button" href="https://ko-fi.com/Z8Z82TKAA" target="_blank">
      <img
        height="36"
        style="border:0px;height:36px;"
        src="/icons/kofi3.png"
        border="0"
        alt="Buy Me a Coffee at ko-fi.com" />
    </a>
  </div>
</div>
