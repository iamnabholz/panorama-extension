<script lang="ts">
    import { appState, persist, uiState } from "./state.svelte";
    import { sound } from "./utils/sound";

    import pkg from "../../package.json" with { type: "json" };
    import { fetchBackground } from "./background";

    /* styles for inputs only */
    import "../styles/inputs.css";
    import { slide } from "svelte/transition";

    const COOLDOWN_MS = 60 * 60 * 1000;

    let summaryDisabled = $derived(
        !appState.displayGreeting &&
            !appState.displayDate &&
            !appState.displayTime &&
            !appState.displayWeather,
    );

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

    function saveImageQuery() {
        waitingResponse = true;
        fetchBackground(queryBind).finally(() => (waitingResponse = false));
    }

    function saveColorCache() {
        appState["color-cache"].startColor = colorBind;

        if (appState["color-cache"].gradient) {
            appState["color-cache"].endColor = colorBindSecondary;
        }
        const newColor = currentColorValue();

        appState.background = {
            type: "color",
            value: newColor,
        };

        applyBackgroundToDOM("color", newColor);
        persist("color-cache", "background");
    }

    function changeBackgroundType(newType: string) {
        const savedValue =
            newType === "image"
                ? (appState["image-cache"]?.url ?? "")
                : newType === "color"
                  ? currentColorValue()
                  : "none";

        appState.background = {
            type: newType,
            value: savedValue,
        };

        applyBackgroundToDOM(newType, savedValue);
        persist("background");
    }

    function handleToggleSound(event: Event) {
        const input = event.target;

        if (input instanceof HTMLInputElement && input.type === "checkbox") {
            input.checked ? sound.playToggleOn() : sound.playToggleOff();
        }
    }
</script>

<div id="float-panel" class="surface" onchange={handleToggleSound}>
    <div id="float-panel__scroll">
        <div class="options-layout">
            <header class="options-header">
                <div class="brand">
                    <div class="brand-title">
                        <h1>Panorama</h1>
                        <span class="version">{pkg.version}</span>
                    </div>
                    <p class="author">
                        by <a href="https://nabholz.work" target="_blank"
                            >Lukas Nabholz</a
                        >
                    </p>
                </div>
                <a
                    href="https://www.buymeacoffee.com/nabholz"
                    target="_blank"
                    class="coffee-link"
                >
                    <img src="/media/bmac-button.webp" alt="Coffee" />
                </a>
            </header>

            <!-- SECTION: SOUND -->
            <section class="option-section">
                <h2 class="section-label">Sounds</h2>
                <div class="input-tray surface-panel">
                    <label class="toggle-row">
                        <span>Play sound on click</span>
                        <input
                            type="checkbox"
                            bind:checked={appState.playSounds}
                            onchange={() => persist("playSounds")}
                        />
                        <div class="toggle-switch"></div>
                    </label>
                </div>
            </section>

            <!-- SECTION: GENERAL -->
            <section class="option-section">
                <h2 class="section-label">Display & Widgets</h2>
                <div class="input-tray surface-panel">
                    {#if summaryDisabled}
                        <p class="warning-text" transition:slide|local>
                            <span class="warning-icon" aria-hidden="true">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    xml:space="preserve"
                                    fill-rule="evenodd"
                                    stroke-linejoin="round"
                                    stroke-miterlimit="2"
                                    clip-rule="evenodd"
                                    width="1em"
                                    height="1em"
                                    viewBox="0 0 32 32"
                                    aria-hidden="true"
                                    focusable="false"
                                >
                                    <path fill="none" d="M0 0h32v32H0z" />
                                    <path
                                        fill-opacity=".14"
                                        d="M12.48 6.47a4.12 4.12 0 0 1 6.9-.02l9.29 14.17A4.12 4.12 0 0 1 25.22 27H6.74a4.12 4.12 0 0 1-3.45-6.36z"
                                    />
                                    <path
                                        d="M12.48 6.47a4.12 4.12 0 0 1 6.9-.02l9.29 14.17A4.12 4.12 0 0 1 25.22 27H6.74a4.12 4.12 0 0 1-3.45-6.36zm1.67 1.09L4.96 21.73A2.12 2.12 0 0 0 6.74 25h18.48A2.12 2.12 0 0 0 27 21.72L17.7 7.55a2.12 2.12 0 0 0-3.55 0"
                                    />
                                    <circle
                                        cx="15.5"
                                        cy="21.5"
                                        r=".5"
                                        transform="matrix(2 0 0 2 -15 -21.5)"
                                    />
                                    <path
                                        d="M15 12.39c0-.5.45-.89 1-.89s1 .4 1 .89v6.22c0 .5-.45.89-1 .89s-1-.4-1-.89z"
                                    />
                                </svg>
                            </span>
                            <span class="warning-content">
                                Nothing is enabled, summary button will not be
                                visible on the control bar
                            </span>
                        </p>
                    {/if}
                    <label class="toggle-row">
                        <span>Show Date & Holidays</span>
                        <input
                            type="checkbox"
                            bind:checked={appState.displayDate}
                            onchange={() => persist("displayDate")}
                        />
                        <div class="toggle-switch"></div>
                    </label>

                    <hr class="divider" />

                    <div class="grouped-fields">
                        <label class="toggle-row">
                            <span>Timely Greeting</span>
                            <input
                                type="checkbox"
                                bind:checked={appState.displayGreeting}
                                onchange={() => persist("displayGreeting")}
                            />
                            <div class="toggle-switch"></div>
                        </label>
                        <div
                            class:is-disabled={!appState.displayGreeting}
                            class="grouped-fields"
                        >
                            <input
                                autocorrect="off"
                                autocomplete="off"
                                type="text"
                                maxlength={12}
                                value={appState.userName ?? ""}
                                placeholder="Your name (e.g. Alex)"
                                disabled={!appState.displayGreeting}
                                oninput={(event) => {
                                    appState.userName =
                                        event.currentTarget.value;
                                    persist("userName");
                                }}
                            />

                            <div class="hint">
                                Enter your name for a personal touch, or leave
                                it blank for a general greeting.
                            </div>
                        </div>

                        <hr class="divider" />

                        <div class="stack-xs">
                            <label class="toggle-row">
                                <span>Clock</span>
                                <input
                                    type="checkbox"
                                    bind:checked={appState.displayTime}
                                    onchange={() => persist("displayTime")}
                                />
                                <div class="toggle-switch"></div>
                            </label>
                            <p class="hint">
                                Tip: You can click the clock on your dashboard
                                to switch between 12h and 24h formats.
                            </p>
                        </div>

                        <hr class="divider" />

                        <div class="stack-xs">
                            <label class="toggle-row">
                                <span>Weather Forecast</span>
                                <input
                                    type="checkbox"
                                    bind:checked={appState.displayWeather}
                                    onchange={() => persist("displayWeather")}
                                />
                                <div class="toggle-switch"></div>
                            </label>
                            <p class="hint">
                                Location is estimated via IP. Click the weather
                                widget to toggle between Celsius and Fahrenheit.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- SECTION: BACKGROUND -->
            <section class="option-section">
                <h2 class="section-label">Background Style</h2>
                <div class="input-tray surface-panel">
                    <div class="choice-group" style="--choice-count: 3;">
                        <button
                            class:selected={appState.background.type === "none"}
                            onclick={() => changeBackgroundType("none")}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                xml:space="preserve"
                                fill-rule="evenodd"
                                stroke-linejoin="round"
                                stroke-miterlimit="2"
                                clip-rule="evenodd"
                                viewBox="0 0 32 32"
                                fill="currentColor"
                            >
                                <path
                                    d="M26.92 5C29.72 5 32 7.28 32 10.08v11.84c0 2.8-2.28 5.08-5.08 5.08H5.08A5.1 5.1 0 0 1 0 21.92V10.08C0 7.28 2.28 5 5.08 5zm0 2H5.08A3.1 3.1 0 0 0 2 10.08v11.84C2 23.62 3.38 25 5.08 25h21.84c1.7 0 3.08-1.38 3.08-3.08V10.08C30 8.38 28.62 7 26.92 7"
                                />
                            </svg>
                            <span>Minimal</span>
                        </button>
                        <button
                            class:selected={appState.background.type ===
                                "color"}
                            onclick={() => changeBackgroundType("color")}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                xml:space="preserve"
                                fill-rule="evenodd"
                                stroke-linejoin="round"
                                stroke-miterlimit="2"
                                clip-rule="evenodd"
                                viewBox="0 0 32 32"
                                fill="currentColor"
                            >
                                <path
                                    d="M26.92 5C29.72 5 32 7.28 32 10.08v11.84c0 2.8-2.28 5.08-5.08 5.08H5.08A5.1 5.1 0 0 1 0 21.92V10.08C0 7.28 2.28 5 5.08 5zm0 2H5.08A3.1 3.1 0 0 0 2 10.08v11.84C2 23.62 3.38 25 5.08 25h21.84c1.7 0 3.08-1.38 3.08-3.08V10.08C30 8.38 28.62 7 26.92 7"
                                />
                                <path
                                    d="m26.64 9 .27.03.26.08.23.12.2.17.17.2.12.23.08.26.03.27v11.28l-.03.27-.08.26-.12.23-.17.2-.2.17-.23.12-.26.08-.27.03H5.36l-.27-.03-.26-.08-.23-.12-.2-.17-.17-.2-.12-.23-.08-.26-.03-.27V10.36l.03-.27.08-.26.12-.23.17-.2.2-.17.23-.12.26-.08.27-.03z"
                                />
                            </svg>
                            <span>Color</span>
                        </button>
                        <button
                            class:selected={appState.background.type ===
                                "image"}
                            onclick={() => changeBackgroundType("image")}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                xml:space="preserve"
                                fill-rule="evenodd"
                                stroke-linejoin="round"
                                stroke-miterlimit="2"
                                clip-rule="evenodd"
                                viewBox="0 0 32 32"
                                fill="currentColor"
                            >
                                <path
                                    d="M26.92 5C29.72 5 32 7.28 32 10.08v11.84c0 2.8-2.28 5.08-5.08 5.08H5.08A5.1 5.1 0 0 1 0 21.92V10.08C0 7.28 2.28 5 5.08 5zm0 2H5.08A3.1 3.1 0 0 0 2 10.08v11.84C2 23.62 3.38 25 5.08 25h21.84c1.7 0 3.08-1.38 3.08-3.08V10.08C30 8.38 28.62 7 26.92 7M5.14 20.33A.66.66 0 0 1 4 19.86v-9.51l.03-.27.08-.26.12-.23.17-.2.2-.17.23-.12.26-.08.27-.03h21.28l.27.03.26.08.23.12.2.17.17.2.12.23.08.26.03.27v7.01a.66.66 0 0 1-1.15.44l-.34-.38-.01-.01a4 4 0 0 0-2.97-1.31c-1.13 0-2.2.48-2.97 1.3l-1.3 1.4a.66.66 0 0 1-.96 0l-2.87-3.09a4 4 0 0 0-2.97-1.3c-1.13 0-2.2.47-2.97 1.3zM20.5 11a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m7.45 10.99-.06.18-.12.23-.17.2-.2.17-.23.12-.26.08-.27.03h-4.13a.7.7 0 0 1-.48-.2l-1.46-1.57a.66.66 0 0 1 0-.9l1.45-1.55h.01a2.02 2.02 0 0 1 3-.01l2.22 2.5.67.75zm-9.5-.1a.66.66 0 0 1-.48 1.11H6.9a.66.66 0 0 1-.48-1.11l4.54-4.8c.4-.43.94-.67 1.51-.68.57 0 1.1.25 1.5.68l3.46 3.7-.05.04.7.66z"
                                />
                            </svg>
                            <span>Images</span>
                        </button>
                    </div>
                    {#if appState.background.type === "image"}
                        <div transition:slide|local class="grouped-fields">
                            <form
                                style="padding-top: 8px;"
                                class="input-field grouped-fields"
                                onsubmit={(e) => {
                                    e.preventDefault();
                                    if (!disableFetchButton) saveImageQuery();
                                }}
                            >
                                <label for="query">Search Unsplash</label>
                                <div class="input-row">
                                    <input
                                        autocorrect="off"
                                        autocomplete="off"
                                        maxlength={24}
                                        id="query"
                                        type="text"
                                        bind:value={queryBind}
                                        placeholder="Keywords (e.g. mountains, dark, space)"
                                    />
                                    <button
                                        type="submit"
                                        class="primary"
                                        disabled={disableFetchButton}
                                    >
                                        {isSameAsCached
                                            ? "Shuffle"
                                            : "Set Topic"}
                                    </button>
                                </div>
                            </form>
                            <div
                                class="input-field grouped-fields"
                                style="padding-top: 16px;"
                            >
                                <span>Auto-Refresh</span>
                                <div
                                    class="choice-group small"
                                    style="--choice-count: 3;"
                                >
                                    {#each ["never", "hourly", "daily"] as freq}
                                        <button
                                            type="button"
                                            class:selected={appState.imageUpdateFrequency ===
                                                freq}
                                            onclick={() => {
                                                appState.imageUpdateFrequency =
                                                    freq;
                                                persist("imageUpdateFrequency");
                                            }}
                                        >
                                            {freq}</button
                                        >
                                    {/each}
                                </div>

                                <p class="hint">
                                    Manual refreshing is limited to once every
                                    few minutes to keep the service fast for
                                    everyone.
                                </p>
                            </div>
                        </div>
                    {:else if appState.background.type === "color"}
                        <div transition:slide|local>
                            <label class="toggle-row">
                                <span>Gradient</span>
                                <input
                                    type="checkbox"
                                    bind:checked={
                                        appState["color-cache"].gradient
                                    }
                                    onchange={(event) => {
                                        appState["color-cache"].gradient =
                                            event.currentTarget.checked;
                                        saveColorCache();
                                    }}
                                />
                                <div class="toggle-switch"></div>
                            </label>

                            <div class="color-grid">
                                <label class="color-field stack-xs">
                                    <span class="small">Primary Color</span>
                                    <input
                                        type="color"
                                        bind:value={colorBind}
                                        oninput={(event) => {
                                            colorBind =
                                                event.currentTarget.value;
                                            saveColorCache();
                                        }}
                                    />
                                </label>
                                {#if appState["color-cache"].gradient}
                                    <label class="color-field stack-xs">
                                        <span class="small"
                                            >Secondary Color</span
                                        >
                                        <input
                                            type="color"
                                            bind:value={colorBindSecondary}
                                            oninput={(event) => {
                                                colorBindSecondary =
                                                    event.currentTarget.value;
                                                saveColorCache();
                                            }}
                                        />
                                    </label>
                                {/if}
                            </div>
                        </div>
                    {/if}
                </div>
            </section>

            <footer class="option-section">
                <h2 class="section-label">About</h2>
                <div class="input-tray surface-panel">
                    <svg
                        width="56px"
                        height="56px"
                        xmlns="http://www.w3.org/2000/svg"
                        xml:space="preserve"
                        fill-rule="evenodd"
                        stroke-linejoin="round"
                        stroke-miterlimit="2"
                        clip-rule="evenodd"
                        viewBox="0 0 32 32"
                    >
                        <path
                            fill="#fcc010"
                            d="M6.13 23.8 4.42 5.5a5 5 0 0 1 8.18-4.3l14.1 11.78a5 5 0 0 1-.87 8.27l-.45.23.94 1.77a5 5 0 0 1-2.1 6.75l-2.66 1.4a5 5 0 0 1-6.75-2.1l-.93-1.77-.44.23a5 5 0 0 1-7.3-3.96"
                        />
                        <path
                            fill="black"
                            d="m10.11 23.43-1.7-18.3a1 1 0 0 1 1.63-.87l14.1 11.8a1 1 0 0 1-.17 1.65l-3.99 2.09 2.8 5.31a1 1 0 0 1-.43 1.35l-2.65 1.4a1 1 0 0 1-1.35-.42l-2.8-5.31-3.98 2.09a1 1 0 0 1-1.46-.8m1.86-1.68 3.54-1.86a1 1 0 0 1 1.35.42l2.8 5.31.88-.46-2.8-5.32a1 1 0 0 1 .43-1.35l3.54-1.86-11.1-9.28z"
                        />
                    </svg>

                    <p>
                        Designed and developed by <a
                            target="_blank"
                            href="https://nabholz.work">Lukas Nabholz</a
                        >.
                    </p>
                    <div class="link-flex">
                        <a
                            href="https://nabholz.notion.site/Panorama-Tab-Privacy-Policy-3cc1169905be80589a79cdba1840f806"
                            target="_blank">Privacy Policy</a
                        >
                        <a
                            href="https://github.com/iamnabholz/panorama-extension"
                            target="_blank">Source Code</a
                        >
                        <a
                            href="https://buymeacoffee.com/nabholz/"
                            target="_blank">Support Development</a
                        >
                    </div>
                    <p class="credits">
                        Backgrounds by Unsplash. Weather by OpenWeatherMap. Font
                        by PangramPangram. Icons by Meteocons.
                    </p>
                </div>
            </footer>
        </div>
    </div>
</div>

<style>
    .options-layout {
        display: flex;
        flex-direction: column;
        gap: var(--space-08);

        padding-block-start: var(--space-06);
    }

    .options-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding-inline: var(--space-04);
    }

    .brand-title {
        display: flex;
        align-items: baseline;
        gap: var(--space-02);
        line-height: 1;
    }
    .brand h1 {
        font-size: var(--font-size-2xl);
        margin: 0;
    }
    .version {
        font-size: var(--font-size-xs);
        opacity: 0.6;
    }
    .author {
        font-size: var(--font-size-sm);
    }
    .coffee-link img {
        width: 130px;
        border-radius: var(--radius-sm);
    }

    .option-section {
        display: flex;
        flex-direction: column;
        gap: var(--space-03);
    }
    .section-label {
        font-size: var(--font-size-xs);
        text-transform: uppercase;
        letter-spacing: 0.03em;
        opacity: 0.5;
        font-weight: 800;
        padding-left: var(--space-05);
    }

    .grouped-fields {
        display: flex;
        flex-direction: column;
        gap: var(--space-04);
    }
    .input-row {
        display: flex;
        gap: var(--space-02);
        transition: opacity var(--duration-fast);
    }

    .color-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-03);
    }

    .stack-xs {
        display: flex;
        flex-direction: column;
        gap: var(--space-02);
    }
    .hint {
        font-size: var(--font-size-sm);
        opacity: 0.6;
        margin-top: calc(var(--space-01) * -1);
        line-height: 1.4;
    }
    .link-flex {
        display: flex;
        column-gap: var(--space-05);
        row-gap: var(--space-02);
        flex-wrap: wrap;
    }

    .credits {
        line-height: 1.4;
    }

    footer {
        font-size: var(--font-size-sm);
    }

    .warning-text {
        display: flex;
        align-items: center;
        gap: var(--space-03);

        background-color: color-mix(in srgb, var(--color-red) 10%, transparent);

        color: var(--color-red);
        padding: var(--space-04);
        padding-top: 14px;
        border-radius: var(--radius-sm);

        font-size: var(--font-size-xs);
        line-height: var(--line-height-tight);
        font-weight: var(--font-weight-bold);
    }

    .warning-icon {
        display: flex;
        flex: 0 0 auto;

        font-size: 1.75rem;
    }

    .warning-content {
        flex: 1;
    }
</style>
