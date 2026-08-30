<script lang="ts">
    import { appState, persist, uiState } from "./state.svelte";
    import pkg from "../../package.json" with { type: "json" };
    import { fetchBackground } from "./background";
    import icon from "../assets/icon.svg?raw";

    import TextInput from "./components/TextInput.svelte";
    import ChoiceInput from "./components/ChoiceInput.svelte";
    import ColorInput from "./components/ColorInput.svelte";
    import CheckboxInput from "./components/CheckboxInput.svelte";
    import { slide } from "svelte/transition";

    const COOLDOWN_MS = 60 * 60 * 1000; // adjust to taste

    let queryBind = $state(appState["image-cache"]?.query ?? "");
    let colorBind = $state(appState["color-cache"].startColor ?? "");

    let isSameAsCached = $derived(
        queryBind.toLowerCase() ===
            (appState["image-cache"]?.query ?? "").toLowerCase(),
    );

    let isCoolingDown = $derived(
        Date.now() < (appState["image-cache"]?.fetchedAt ?? 0) + COOLDOWN_MS,
    );

    let waitingResponse = $state(false);

    let disableFetchButton = $derived(
        (isSameAsCached && isCoolingDown) || waitingResponse,
    );

    function setImageQuery(newQuery: string) {
        waitingResponse = true;
        fetchBackground(newQuery).finally(() => (waitingResponse = false));
    }

    function setBackgroundColor(newColor: string) {
        appState.background.value = newColor;
        appState["color-cache"].startColor = newColor;
        persist();

        document.documentElement.style.setProperty("--bg-color", newColor);
        document.documentElement.style.setProperty("--bg-image", "");
    }

    // save whenever it changes
    function changeBackgroundType(newType: string) {
        let savedValue: string;

        if (newType === "image") {
            const cached = appState["image-cache"];
            savedValue = cached?.url ?? "";

            document.documentElement.style.setProperty(
                "--bg-color",
                "var(--background-color)",
            );
            document.documentElement.style.setProperty(
                "--bg-image",
                `url("${savedValue}")`,
            );
        } else {
            colorBind = appState["color-cache"].startColor;
            savedValue = colorBind;
            document.documentElement.style.setProperty(
                "--bg-color",
                savedValue,
            );
            document.documentElement.style.setProperty("--bg-image", "");
        }

        appState.background = {
            type: newType,
            value: savedValue,
        };
        persist();
    }
</script>

<div id="options-panel" class="glass">
    <div class="basic-row" style="font-size: 0.8em; padding: 28px 0 16px 0;">
        <span style="width: 56px; height: auto;">
            {@html icon}
        </span>
        <div class="basic-column" style="gap: 0;">
            <span>
                <b style="font-size: 1rem;">Panorama Tab</b>
                <span style="color: var(--options-text-mix);">
                    {pkg.version}
                </span>
            </span>

            <span>
                Made by
                <a target="_blank" href="https://nabholz.work">
                    Lukas Nabholz
                </a>
            </span>
        </div>
        <a
            class="image-link"
            href="https://www.buymeacoffee.com/nabholz"
            target="_blank"
        >
            <img
                src="/icons/ui/bmac-button.webp"
                alt="Buy Me A Coffee"
                style="width: 140px !important;"
            />
        </a>
    </div>

    <div class="section-header">Options</div>

    <CheckboxInput
        id="greeting-on"
        label="Show greeting"
        bind:checked={appState.displayGreeting}
        onChange={() => persist()}
    />

    <div class="basic-column">
        <CheckboxInput
            id="time-on"
            label="Show current time"
            bind:checked={appState.displayTime}
            onChange={() => persist()}
        />
        <p class="hint">
            Click the clock widget to switch between 12-hour and 24-hour format.
        </p>
    </div>

    <div class="basic-column">
        <CheckboxInput
            id="weather-on"
            label="Show weather"
            bind:checked={appState.displayWeather}
            onChange={() => persist()}
        />

        <p class="hint">
            Click the temperature widget to switch between Celsius and
            Fahrenheit.
        </p>
    </div>

    <ChoiceInput
        id="bg-type"
        label="Background"
        options={[
            {
                value: "image",
                label: "Image",
            },
            {
                value: "color",
                label: "Color",
            },
        ]}
        value={appState.background.type}
        onChange={(v) => changeBackgroundType(v)}
    />
    {#if appState.background.type == "image"}
        <p class="hint">Use an image from Unsplash as background.</p>

        <TextInput
            id="bg-query-input"
            label="image Topic"
            bind:value={queryBind}
            placeholder="e.g. ocean, sunset, city at night"
            buttonLabel={isSameAsCached ? "New Image" : "Search"}
            disableButton={disableFetchButton}
            onSubmit={(v) => setImageQuery(v)}
        />

        <ChoiceInput
            id="bg-update"
            label="image update frequency"
            options={[
                {
                    value: "never",
                    label: "Manually",
                },
                {
                    value: "hourly",
                    label: "Hourly",
                },
                {
                    value: "daily",
                    label: "Daily",
                },
            ]}
            bind:value={appState.imageUpdateFrequency}
            onChange={() => persist()}
        />
    {:else}
        <ColorInput
            id="bg-color"
            label="Pick Color"
            bind:value={colorBind}
            onChange={(v) => setBackgroundColor(v)}
        />
    {/if}

    <div class="section-header" style="padding-top: 24px;">About</div>
    <div class="basic-column about-links">
        <a target="_blank" href="mailto:support@nabholz.work">
            support@nabholz.work
        </a>
        <a target="_blank" href="https://nabholz.work"> Privacy Policy </a>
        <span>
            Icons by
            <a target="_blank" href="https://pixelarticons.com">
                PixelArtIcons
            </a>
        </span>
        <span>
            Font by
            <a target="_blank" href="https://pangrampangram.com">
                PangramPangram
            </a>
        </span>
        <span>
            Weather information from
            <a target="_blank" href="https://openweathermap.org">
                OpenWeatherMap
            </a>
        </span>
        <span>
            Images from
            <a target="_blank" href="https://unsplash.com"> Unsplash </a>
        </span>
    </div>

    <br />
</div>

<style>
    #options-panel {
        color: var(--color-white);

        width: min(500px, 90%);
        height: min(460px, 80%);
        padding: 16px;

        border-radius: 12px;

        overflow: hidden; /* clips both columns to the panel's rounded corners */
        overflow-y: auto;
        scrollbar-gutter: stable;

        display: flex;
        flex-direction: column;
        gap: 1rem;

        background-color: var(--black-40);
        z-index: 1;
    }
    .section-header {
        font-size: 0.8em;
        font-weight: bold;
        border-bottom: 1px solid var(--white-20);
        width: 100%;
        padding-bottom: 8px;
    }

    .basic-column {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 4px;
        width: 100%;
        box-sizing: border-box;
    }

    .basic-row {
        display: flex;
        align-items: center;
        gap: 4px;
    }

    :global(.hint) {
        font-size: 0.8em;
        color: var(--white-80);
        cursor: default;
        line-height: 1.1;
    }

    a {
        width: fit-content;
    }

    .about-links {
        font-size: 0.6em;
        gap: 8px;
    }

    .image-link {
        cursor: pointer;
        border: none;
    }
</style>
