<script lang="ts">
    import { appState, persist } from "./state.svelte";
    import pkg from "../../package.json" with { type: "json" };
    import { fetchBackground } from "./background";
    import icon from "../assets/icon.svg?raw";

    import TextInput from "./components/TextInput.svelte";
    import ChoiceInput from "./components/ChoiceInput.svelte";
    import ColorInput from "./components/ColorInput.svelte";
    import CheckboxInput from "./components/CheckboxInput.svelte";

    const COOLDOWN_MS = 60 * 60 * 1000; // adjust to taste

    let queryBind = $state(appState["image-cache"]?.query ?? "");
    let colorBind = $state(appState["color-cache"].startColor ?? "");
    let colorBindSecondary = $derived(
        appState["color-cache"].endColor ?? colorBind,
    );

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

    function applyBackgroundToDOM(type: string, value: string) {
        document.documentElement.style.setProperty(
            "--background-value",
            type === "image" ? `url("${value}")` : value,
        );
    }

    function buildColorProperty(startColor: string, endColor: string) {
        return `linear-gradient(33deg, ${startColor} 0%, ${endColor} 100%)`;
    }

    function currentColorValue() {
        const start = colorBind;
        const end = appState["color-cache"].gradient
            ? colorBindSecondary
            : colorBind;
        return buildColorProperty(start, end);
    }

    function saveImageQuery(newQuery: string) {
        waitingResponse = true;
        fetchBackground(newQuery).finally(() => (waitingResponse = false));
    }

    function saveColorCache() {
        appState["color-cache"].startColor = colorBind;
        if (appState["color-cache"].gradient) {
            appState["color-cache"].endColor = colorBindSecondary;
        }

        const newColor = currentColorValue();
        appState.background = { type: "color", value: newColor };
        applyBackgroundToDOM("color", newColor);
        persist();
    }

    function changeBackgroundType(newType: string) {
        const savedValue =
            newType === "image"
                ? (appState["image-cache"]?.url ?? "")
                : currentColorValue();

        appState.background = { type: newType, value: savedValue };
        applyBackgroundToDOM(newType, savedValue);
        persist();
    }
</script>

<div id="float-panel" class="glass">
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
            onSubmit={(v) => saveImageQuery(v)}
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
        <CheckboxInput
            id="gradient-color"
            label="Make it gradient"
            bind:checked={appState["color-cache"].gradient}
            onChange={() => saveColorCache()}
        />

        <ColorInput
            id="start-color"
            label={appState["color-cache"].gradient
                ? "Start Color"
                : "Pick Color"}
            bind:value={colorBind}
            onChange={() => saveColorCache()}
        />

        {#if appState["color-cache"].gradient}
            <ColorInput
                id="end-color"
                label="End Color"
                bind:value={colorBindSecondary}
                onChange={() => saveColorCache()}
            />
        {/if}
    {/if}

    <div class="section-header" style="padding-top: 24px;">About</div>
    <div class="basic-column about-links">
        <div class="link-row">
            <span>{pkg.name} v{pkg.version}</span>
            <a
                target="_blank"
                href="https://nabholz.notion.site/Panorama-Tab-Privacy-Policy-3cc1169905be80589a79cdba1840f806"
            >
                Privacy Policy
            </a>
            <a
                target="_blank"
                href="https://github.com/iamnabholz/panorama-extension"
            >
                GitHub
            </a>
        </div>
        <p class="credits">
            Icons from <a href="https://pixelarticons.com">PixelArtIcons</a>,
            font from <a href="https://pangrampangram.com">PangramPangram</a>,
            weather from
            <a href="https://openweathermap.org">OpenWeatherMap</a>, and
            backgrounds from <a href="https://unsplash.com">Unsplash</a>.
        </p>
    </div>
</div>

<style>
    .section-header {
        font-size: 0.8em;
        font-weight: bold;
        border-bottom: 1px solid var(--white-20);
        width: 100%;
        padding-bottom: 8px;
    }

    :global(.hint) {
        font-size: 0.8em;
        color: var(--white-80);
        cursor: default;
        line-height: 1.1;
    }

    a {
        cursor: pointer;
        width: fit-content;
    }

    .about-links {
        font-size: var(--panel-text-xs, 0.7em);
        gap: 8px;
        margin-bottom: 4vh;
    }

    .link-row {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
    }

    .credits {
        margin-top: 12px;
        color: var(--white-80);
        line-height: 1.8;
    }

    .credits a {
        color: inherit;
        border-bottom-color: var(--white-60, currentColor);
    }

    .image-link {
        cursor: pointer;
        border: none;
    }
</style>
