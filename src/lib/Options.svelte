<script>
  import { fade, slide } from "svelte/transition";
  import {
    optionsPageOpened,
    getNewBackground,
    backgroundQuery,
    backgroundColor,
    weatherCoordinates,
    settings,
    updateSetting,
    subredditList,
  } from "../stores.js";
  import Checkbox from "./components/Checkbox.svelte";
  import OptionSection from "./components/OptionSection.svelte";
  import {
    attemptLocationRequest,
    checkTimerDone,
    getColorForSubreddit,
  } from "../utils.js";
  import browser from "webextension-polyfill";

  const closeOptionsPanel = () => {
    optionsPageOpened.set(false);
  };

  const weatherInfo = JSON.parse(localStorage.getItem("weather-resp"));

  let inputBackgroundQuery = $backgroundQuery;
  let inputBackgroundColor = $backgroundColor;

  $: backgroundInputCheck = (() => {
    if (
      inputBackgroundQuery.trim().length > 3 &&
      inputBackgroundQuery.trim().length < 48
    ) {
      if (
        inputBackgroundQuery.toLowerCase().trim() ===
        $backgroundQuery.toString().toLowerCase().trim()
      ) {
        return !checkTimerDone(parseInt(localStorage.getItem("bg-up")));
      }
      return false;
    }
    return true;
  })();

  const attemptGetBackground = () => {
    backgroundQuery.set(inputBackgroundQuery);
    getNewBackground.set(true);
  };

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
        <span
          class="row-wrapper"
          style="align-items: center; cursor: default;"
          title="Location was automatically grabbed within the weather request."
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            style="opacity: 0.6;"
            ><path
              d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 5.999l-5.621 2.986c-.899-.104-1.806.191-2.474.859-.662.663-.95 1.561-.862 2.428l-3.043 5.728 5.724-3.042c.884.089 1.772-.205 2.432-.865.634-.634.969-1.524.859-2.473l2.985-5.621zm-5.97 7.22c-.689 0-1.25-.559-1.25-1.249-.001-.691.559-1.251 1.25-1.25.69 0 1.25.56 1.25 1.25-.001.689-.56 1.249-1.25 1.249zm.79-9.409v2.108h-.457l-.004-.007-.801-1.355v1.362h-.436v-2.108h.454l.808 1.365v-1.365h.436zm6.235 8.734v-.48h.957v-.384h-.957v-.417h1.043v-.413h-1.507v2.108h1.529v-.414h-1.065zm-12.998-1.694l-.315 1.395-.329-1.395h-.43l-.334 1.377-.304-1.377h-.465l.527 2.098.003.011h.463l.32-1.378.326 1.378h.455l.538-2.108h-.455zm5.188 9.209c.119.066.358.132.601.132.582 0 .853-.302.853-.657 0-.302-.173-.497-.547-.636-.277-.106-.394-.166-.394-.302 0-.106.101-.204.309-.204.204 0 .358.06.44.101l.106-.384c-.126-.06-.299-.107-.541-.107-.497 0-.802.274-.802.636 0 .312.232.507.585.632.255.089.355.167.355.296 0 .142-.116.233-.337.233-.204 0-.405-.066-.531-.133l-.097.393z"
            />
          </svg>
          <p>{weatherInfo.name}</p>
        </span>
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
                  attemptGetBackground();
                }
              }}
            />
            <button
              disabled={backgroundInputCheck}
              on:click={attemptGetBackground}
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

  @media screen and (max-width: 460px) {
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
