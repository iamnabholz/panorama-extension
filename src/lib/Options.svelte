<script lang="ts">
    import pkg from "../../package.json" with { type: "json" };
    import icon from "../assets/icon.svg?raw";
    import TextInput from "./components/TextInput.svelte";
    import ChoiceInput from "./components/ChoiceInput.svelte";
    import { appState, setBackground, setState } from "./state.svelte";
    import ColorInput from "./components/ColorInput.svelte";

    function updateBgColor() {
        setBackground("color", appState.bgColor);

        document.documentElement.style.setProperty(
            "--bg-color",
            appState.bgColor,
        );
        document.documentElement.style.setProperty("--bg-url", "");
    }

    // save whenever it changes
    function handleBgTypeChange(newValue: string) {
        if (newValue == "image") {
            const urlCache = localStorage.getItem("image-cache") ?? "";
            setBackground("image", urlCache);

            document.documentElement.style.setProperty(
                "--bg-url",
                `url("${urlCache}")`,
            );
        } else {
            updateBgColor();
        }
    }

    function handleSubmit() {
        if (appState.bgQuery.trim().length === 0) return;
        // onSubmit(bgQuery.trim());

        setState("bgQuery", appState.bgQuery.trim());
    }

    let hourlyUpdate = $state("false");
</script>

<div id="options-panel" class="basic-column">
    <div class="basic-column credits-column">
        <div class="basic-column">
            <span style="width: 32px; height: 32px;">
                {@html icon}
            </span>
            <span>
                <b>Panorama Tab</b>
                <span style="color: var(--foreground-60)">
                    {pkg.version}
                </span>
            </span>
            <span style="font-size: 0.8em;">
                Made by
                <a target="_blank" href="https://nabholz.work">
                    Lukas Nabholz
                </a>
            </span>
        </div>
        <div class="basic-column">
            <span class="basic-column" style="font-size: 0.6em; gap: 6px;">
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
                    Background images from
                    <a target="_blank" href="https://unsplash.com">
                        Unsplash
                    </a>
                </span>
            </span>
        </div>
    </div>

    <div class="basic-column options-column">
        <span style="font-size: 1.2em; font-weight: bold;">Options</span>
        <hr class="separator" style="margin-top: 6px;" />

        <ChoiceInput
            id="bg-type"
            label="Background Style"
            options={[
                {
                    value: "image",
                    label: "Image",
                    description: "Use an image from Unsplash as background.",
                },
                {
                    value: "color",
                    label: "Color",
                    description:
                        "Set a solid color or gradient to use as background.",
                },
            ]}
            bind:value={appState.backgroundType}
            onChange={handleBgTypeChange}
        />
        {#if appState.backgroundType == "image"}
            <br />
            <TextInput
                id="bg-query-input"
                label="Image Topic"
                bind:value={appState.bgQuery}
                placeholder="What kind of background you'd like?"
                buttonLabel="Search"
                description="Set a topic related to the type of images you'd like to get as background."
                onSubmit={handleSubmit}
            />
            <br />

            <ChoiceInput
                id="bg-update"
                label="Image update frequency"
                options={[
                    {
                        value: "1",
                        label: "1h",
                    },
                    {
                        value: "3",
                        label: "3h",
                    },
                    {
                        value: "8",
                        label: "8h",
                    },
                    {
                        value: "12",
                        label: "12h",
                    },
                    {
                        value: "24",
                        label: "24h",
                    },
                ]}
                bind:value={hourlyUpdate}
                onChange={() => {}}
            />
        {:else}
            <br />
            <ColorInput
                id="bg-color"
                label="Pick Color"
                bind:value={appState.bgColor}
                onChange={updateBgColor}
            />
        {/if}
    </div>
</div>

<style>
    #options-panel {
        background-color: var(--background-color);
        color: var(--foreground-color);

        width: min(740px, 100%);
        height: min(460px, 80%);
        border-radius: 12px;
        display: grid;
        grid-template-columns: 3fr 5fr;
        overflow: hidden; /* clips both columns to the panel's rounded corners */

        box-shadow: 0 2px 30px rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .credits-column {
        padding: 24px;
        height: 100%;
        box-sizing: border-box;
        justify-content: space-between;
        background-color: var(--foreground-10);
    }

    .options-column {
        padding: 24px;
        height: 100%;
        box-sizing: border-box;
        overflow-y: auto;
        scrollbar-gutter: stable;
    }

    .basic-column {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
        width: 100%;
        box-sizing: border-box;
    }

    .basic-row {
        display: flex;
        align-items: center;
        gap: 4px;
    }

    .separator {
        display: block;
        width: 100%;
        min-width: 100%;
        max-width: 100%;
        flex-shrink: 0;
        height: 1px;
        border: none;
        background-color: var(--foreground-10);
        margin: 24px 0;
        box-sizing: border-box;
    }
</style>
