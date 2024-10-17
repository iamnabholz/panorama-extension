<script>
  import { fade, slide } from "svelte/transition";
  import {
    optionsPageOpened,
    backgroundQuery,
    backgroundColor,
    weatherCoordinates,
    settings,
    updateSetting,
    subredditList,
  } from "../stores.js";
  import Checkbox from "./components/Checkbox.svelte";
  import OptionSection from "./components/OptionSection.svelte";
  import { attemptLocationRequest, getColorForSubreddit } from "../utils.js";
  import browser from "webextension-polyfill";

  const closeOptionsPanel = () => {
    optionsPageOpened.set(false);
  };

  const weatherInfo = JSON.parse(localStorage.getItem("weather-resp"));

  let inputLatitude = $weatherCoordinates.lat;
  let inputLongitude = $weatherCoordinates.lon;

  let waitingForLocationRequest = false;
  const requestLocation = () => {
    waitingForLocationRequest = true;
    attemptLocationRequest()
      .then((coords) => {
        waitingForLocationRequest = false;
        inputLatitude = coords.lat;
        inputLongitude = coords.lon;
        //console.log("Coordinates:", coords);
      })
      .catch((err) => {
        waitingForLocationRequest = false;
        console.log("Error trying to request location:", err);
      });
  };

  let inputBackgroundQuery = $backgroundQuery;
  let inputBackgroundColor = $backgroundColor;

  let subredditInput = "";

  const addSubreddit = () => {
    if (!checkInput(subredditInput) && $subredditList.length < 10) {
      const updatedList = [subredditInput, ...$subredditList];
      subredditList.set(updatedList);
      subredditInput = "";
    }
  };

  const deleteSubreddit = (subreddit) => {
    const updatedList = $subredditList.filter(
      (subredditName) => subredditName !== subreddit,
    );
    subredditList.set(updatedList);
  };

  function checkInput(input) {
    input = input.trim();
    input = input.replace(/ /g, "");
    subredditInput = input;

    if (input.length > 2 && !$subredditList.includes(input)) {
      return false;
    }
    return true;
  }

  let activeOption = null;

  const toggleSection = (sectionId) => {
    activeOption = activeOption === sectionId ? null : sectionId;
  };

  const appVersion = browser.runtime.getManifest().version;
</script>

<div
  role="button"
  aria-label="Close panel"
  tabindex="0"
  on:click={closeOptionsPanel}
  on:keypress={(event) => {
    console.log(event);
  }}
  class="options-background"
  transition:fade
></div>

<div class="options" transition:slide>
  <h1 style="padding: 12px 2px 2px 12px; font-size: 1rem; opacity: 1;">
    Panorama Tab Options
  </h1>

  <OptionSection
    showOptions={activeOption === "date"}
    toggleOptions={() => toggleSection("date")}
  >
    <span slot="title">Date</span>
    <span class="option-container" slot="content">
      <Checkbox
        id="date"
        checkboxValue={$settings.dateActive}
        checkboxAction={() => {
          updateSetting("dateActive");
        }}
      >
        <p>Show current date and national holiday if any</p>
      </Checkbox>
    </span>
  </OptionSection>

  <OptionSection
    showOptions={activeOption === "weather"}
    toggleOptions={() => toggleSection("weather")}
  >
    <span slot="title">Weather</span>
    <span class="option-container" slot="content">
      <Checkbox
        id="weather"
        checkboxValue={$settings.weatherActive}
        checkboxAction={() => {
          updateSetting("weatherActive");
        }}
      >
        <p>Show weather for your location</p>
      </Checkbox>

      {#if $settings.weatherActive}
        <!--
        <span class="row-wrapper">
          <span class="column-wrapper">
            <label for="latitude">Latitude:</label>
            <input
              step="0.01"
              id="latitude"
              type="number"
              bind:value={inputLatitude}
            />
          </span>
          <span class="column-wrapper">
            <label for="longitude">Longitude:</label>
            <input
              step="0.01"
              id="longitude"
              type="number"
              bind:value={inputLongitude}
            />
          </span>
        </span>
        <button
          disabled={inputLatitude === $weatherCoordinates.lat &&
            inputLongitude === $weatherCoordinates.lon}
          on:click={() => {
            weatherCoordinates.set({ lat: inputLatitude, lon: inputLongitude });
          }}
        >
          Set
        </button>
        <br />
        <p>
          Request coordinates from your browser, you might be prompted to give
          location access
        </p>
        <button
          disabled={waitingForLocationRequest}
          style="height: 50px;"
          on:click={requestLocation}
        >
          {#if waitingForLocationRequest}
            <LoadingIndicator />
          {:else}
            Get Coordinates
          {/if}
        </button>

        <br />
      -->
        <p>{weatherInfo.name}</p>
        <span
          role="button"
          aria-label="Temperature unit selector"
          tabindex="0"
          on:click={() => {
            updateSetting("usingMetric");
          }}
          on:keydown={(e) => {}}
          class="row-wrapper"
          style="align-items: center; justify-content: space-between;"
        >
          <label for="unit">Temperature unit</label>
          <div id="unit" class="multiple-choice">
            <p class:selected={$settings.usingMetric}>°C</p>
            <p class:selected={!$settings.usingMetric}>°F</p>
          </div>
        </span>
      {/if}
    </span>
  </OptionSection>

  <OptionSection
    showOptions={activeOption === "top"}
    toggleOptions={() => toggleSection("top")}
  >
    <span slot="title">Top Sites</span>
    <span class="option-container" slot="content">
      <Checkbox
        id="sites"
        checkboxValue={$settings.sitesActive}
        checkboxAction={() => {
          updateSetting("sitesActive");
        }}
      >
        <p>Show your top sites</p>
      </Checkbox>
    </span>
  </OptionSection>

  <OptionSection
    showOptions={activeOption === "reddit"}
    toggleOptions={() => toggleSection("reddit")}
  >
    <span slot="title">Reddit</span>
    <span class="option-container" slot="content">
      <Checkbox
        id="reddit"
        checkboxValue={$settings.redditActive}
        checkboxAction={() => {
          updateSetting("redditActive");
        }}
      >
        <p>Show posts from your selected subreddits</p>
      </Checkbox>

      {#if $settings.redditActive}
        <label for="subreddit">Subreddit:</label>
        <span class="row-wrapper">
          <div
            style="position: absolute; padding-left: 10px; opacity: 0.4; top: 1rem;"
          >
            r/
          </div>
          <input
            style="padding-left: 23px;"
            maxlength="21"
            type="text"
            placeholder="example"
            id="subreddit"
            bind:value={subredditInput}
            on:keypress={(event) => {
              if (event.key === "Enter") {
                addSubreddit();
              }
            }}
          />
          <button
            disabled={checkInput(subredditInput) || $subredditList.length > 10}
            on:click={addSubreddit}
          >
            Add
          </button>
        </span>

        <span class="row-wrapper" style="flex-wrap: wrap;  min-height: 2rem;">
          {#if $subredditList.length <= 0}
            <p style="text-align: center; align-self: center;">
              Start adding your favorite subreddits.
            </p>
          {:else}
            {#each $subredditList as subreddit (subreddit)}
              <p
                class="row-wrapper subreddit-pill"
                style="--color: {getColorForSubreddit(subreddit)};"
                transition:slide={{ axis: "x" }}
              >
                <button
                  title="Remove subreddit"
                  on:click={() => {
                    deleteSubreddit(subreddit);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    ><path
                      d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"
                    /></svg
                  >
                </button>
                r/{subreddit}
              </p>
            {/each}
          {/if}
        </span>
      {/if}
    </span>
  </OptionSection>

  <OptionSection
    showOptions={activeOption === "background"}
    toggleOptions={() => toggleSection("background")}
  >
    <span slot="title">Background</span>
    <span class="option-container" slot="content">
      <Checkbox
        id="bg"
        checkboxValue={$settings.backgroundActive}
        checkboxAction={() => {
          updateSetting("backgroundActive");
        }}
      >
        <p>Enable background images</p>
      </Checkbox>

      {#if $settings.backgroundActive}
        <span class="column-wrapper" transition:slide>
          <Checkbox
            id="auto"
            checkboxValue={$settings.updateBackground}
            checkboxAction={() => {
              updateSetting("updateBackground");
            }}
          >
            <p>Refresh background every hour</p>
          </Checkbox>

          <label for="query">Search query:</label>
          <span class="row-wrapper">
            <input
              id="query"
              bind:value={inputBackgroundQuery}
              type="text"
              on:keypress={(event) => {
                if (event.key === "Enter") {
                  backgroundQuery.set(inputBackgroundQuery);
                }
              }}
            />
            <button
              disabled={inputBackgroundQuery.toLowerCase().trim() ===
                $backgroundQuery.toString().toLowerCase().trim() ||
                inputBackgroundQuery.trim().length < 3}
              on:click={() => {
                backgroundQuery.set(inputBackgroundQuery);
              }}
            >
              Get
            </button>
          </span>
        </span>
      {:else}
        <span class="column-wrapper" transition:slide>
          <label for="color">HEX color:</label>
          <span class="row-wrapper">
            <input id="color" bind:value={inputBackgroundColor} type="color" />
            <button
              disabled={inputBackgroundColor === $backgroundColor}
              on:click={() => {
                backgroundColor.set(inputBackgroundColor);
              }}
            >
              Set
            </button>
          </span>
        </span>
      {/if}
    </span>
  </OptionSection>

  <OptionSection
    showOptions={activeOption === "about"}
    toggleOptions={() => toggleSection("about")}
  >
    <span slot="title">About</span>
    <span class="option-container" slot="content">
      <span class="column-wrapper credits">
        <a href="https://www.buymeacoffee.com/nabholz" target="_blank">
          <img
            src="icons/ui/bmac-button.webp"
            alt="Buy Me A Coffee"
            style="height: 43px !important; width: 155px !important;"
          />
        </a>

        <p>
          Panorama Tab v{appVersion} <br /> by
          <a href="https://nabholz.work/">Lukas Nabholz</a>
        </p>

        <span
          class="row-wrapper"
          style="justify-content: space-between; width: 100%;"
        >
          <a href="https://panoramatab.netlify.app/privacy%20policy.html">
            Privacy Policy
          </a>

          <a href="mailto:support@nabholz.work">support@nabholz.work</a>
        </span>
      </span>
    </span>
  </OptionSection>
</div>

<style>
  .options-background {
    position: fixed;
    left: 0;
    bottom: 0;
    height: 100vh;
    width: 100vw;
    background-color: var(--darker-color);
    opacity: 0.25;
  }

  .options {
    position: fixed;
    left: 1rem;
    bottom: 4rem;
    max-height: calc(100% - 8rem);
    width: min(420px, 100%);
    border-radius: 8px;
    background-color: var(--background-color);
    display: flex;
    flex-direction: column;
    overflow: scroll;
  }

  label {
    font-size: 1rem;
    font-weight: 800;
    color: var(--text-color);
    opacity: 0.6;
  }

  input {
    background-color: var(--dark-color);
    width: 100%;
  }

  p {
    line-height: 1.2;
  }

  .option-container {
    padding: 14px;
    background-color: var(--darker-color);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .subreddit-pill {
    padding: 4px 14px 4px 8px;
    border-radius: 40px;
    color: var(--color);
    background-color: var(--background-color);
    font-weight: 600;
    align-items: center;
    gap: 8px;
    cursor: default;
  }

  .subreddit-pill button {
    padding: 4px;
    border-radius: 50px;
    color: var(--background-color);
    border: none;
    background-color: var(--text-color);
  }

  .subreddit-pill button:hover {
    box-shadow: none;
  }

  input[type="color"] {
    height: auto;
    padding: 4px 8px;
  }

  .credits {
    align-items: center;
    gap: 1rem;
    text-align: center;
  }

  @media screen and (max-width: 680px) {
    .options {
      left: 1rem;
      right: 1rem;
      width: auto;
    }
  }

  @media (prefers-color-scheme: light) {
    input {
      background-color: var(--light-color);
    }
    .option-container {
      background-color: var(--lighter-color);
    }
  }
</style>
