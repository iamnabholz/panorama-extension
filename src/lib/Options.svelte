<script lang="ts">
    import { appState, persist } from "./state.svelte";
    import pkg from "../../package.json" with { type: "json" };
    import { fetchBackground } from "./background";
    import icon from "../assets/icon.svg?raw";

    import TextInput from "./components/TextInput.svelte";
    import ChoiceInput from "./components/ChoiceInput.svelte";
    import ColorInput from "./components/ColorInput.svelte";

    let queryBind = $state(appState["image-cache"]?.query ?? "");
    let colorBind = $state(appState["color-cache"].startColor ?? "");

    function setImageQuery(newQuery: string) {
        if (appState["image-cache"]) appState["image-cache"].query = newQuery;

        fetchBackground(newQuery).then((result) => {
            if (result?.url) {
                appState.background.value = result.url;
                persist();

                document.documentElement.style.setProperty(
                    "--bg-image",
                    `url("${result.url}")`,
                );
            }
        });
    }

    function setBackgroundColor(newColor: string) {
        appState.background.value = newColor;
        appState["color-cache"].startColor = newColor;
        persist();
    }

    // save whenever it changes
    function changeBackgroundType(newType: string) {
        let savedValue: string;

        if (newType === "image") {
            const cached = appState["image-cache"];

            savedValue = cached?.url ?? "";

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

<div id="options-panel" class="basic-column">
    <div class="basic-column credits-column">
        <div class="basic-column">
            <span
                style="width: 64px; height: 64px; transform: translateX(-5px);"
            >
                {@html icon}
            </span>
            <br />
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
        <span
            class="basic-column"
            style="font-size: 0.6em; gap: 6px; color: var(--foreground-60);"
        >
            <span style="font-weight: bold;"> Credits </span>
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
                <a target="_blank" href="https://unsplash.com"> Unsplash </a>
            </span>
        </span>
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
            value={appState.background.type}
            onChange={(v) => changeBackgroundType(v)}
        />
        {#if appState.background.type == "image"}
            <br />
            <TextInput
                id="bg-query-input"
                label="Image Topic"
                value={queryBind}
                placeholder="What kind of background you'd like?"
                buttonLabel="Search"
                description="Set a topic related to the type of images you'd like to get as background."
                onSubmit={(v) => setImageQuery(v)}
            />
            <br />

            <ChoiceInput
                id="bg-update"
                label="Image update frequency"
                options={[
                    {
                        value: "0",
                        label: "Never",
                    },
                    {
                        value: "60",
                        label: "Hourly",
                    },
                    {
                        value: "24",
                        label: "Daily",
                    },
                ]}
                value="0"
                onChange={() => {}}
            />
        {:else}
            <br />
            <ColorInput
                id="bg-color"
                label="Pick Color"
                value={colorBind}
                onChange={(v) => setBackgroundColor(v)}
            />
        {/if}
    </div>
</div>

<style>
    #options-panel {
        background-color: var(--background-color);
        color: var(--foreground-color);

        width: min(740px, 90%);
        height: min(460px, 80%);
        border-radius: 12px;
        display: grid;
        grid-template-columns: 3fr 5fr;
        overflow: hidden; /* clips both columns to the panel's rounded corners */

        box-shadow: 0 2px 30px rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .credits-column {
        padding: min(24px, 8%);

        height: 100%;
        box-sizing: border-box;
        justify-content: space-between;
        background-color: var(--foreground-10);
    }

    .options-column {
        padding: min(24px, 6%);
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

    /*.basic-row {
        display: flex;
        align-items: center;
        gap: 4px;
        }*/

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
