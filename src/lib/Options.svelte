<script lang="ts">
    import { appState, persist } from "./state.svelte";
    import pkg from "../../package.json" with { type: "json" };
    import { fetchBackground } from "./background";

    /* Global shared styles */
    import "../styles/inputs.css";

    const COOLDOWN_MS = 60 * 60 * 1000;

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

<div id="float-panel" class="surface">
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

            <!-- SECTION: GENERAL -->
            <section class="option-section">
                <h2 class="section-label">Summary</h2>
                <div class="input-tray surface-panel">
                    <label class="toggle-row">
                        <span>Date & Holidays</span>
                        <input
                            type="checkbox"
                            bind:checked={appState.displayDate}
                            onchange={persist}
                        />
                        <div class="toggle-switch"></div>
                    </label>

                    <hr class="divider" />

                    <div class="grouped-fields">
                        <label class="toggle-row">
                            <span>Greetings</span>
                            <input
                                type="checkbox"
                                bind:checked={appState.displayGreeting}
                                onchange={persist}
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
                                placeholder="e.g. Mark, Alice"
                                disabled={!appState.displayGreeting}
                                oninput={(e) => {
                                    const val = (
                                        e.currentTarget as HTMLInputElement
                                    ).value;
                                    // Trim leading/trailing spaces for the saved state, or keep empty if blank
                                    appState.userName =
                                        val.trim() === "" ? "" : val.trim();
                                    persist();
                                }}
                            />

                            <div class="hint">
                                Type your name for more personalized greetings,
                                or leave empty for only general greetings.
                            </div>
                        </div>

                        <hr class="divider" />

                        <div class="stack-xs">
                            <label class="toggle-row">
                                <span>Current Time</span>
                                <input
                                    type="checkbox"
                                    bind:checked={appState.displayTime}
                                    onchange={persist}
                                />
                                <div class="toggle-switch"></div>
                            </label>
                            <p class="hint">
                                Click the clock widget to toggle 12/24h format.
                            </p>
                        </div>

                        <hr class="divider" />

                        <div class="stack-xs">
                            <label class="toggle-row">
                                <span>Weather Information</span>
                                <input
                                    type="checkbox"
                                    bind:checked={appState.displayWeather}
                                    onchange={persist}
                                />
                                <div class="toggle-switch"></div>
                            </label>
                            <p class="hint">
                                Click the temperature widget to toggle between
                                °C/°F.
                                <br />
                                Weather is wrong? We determine your location based
                                on your IP address.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- SECTION: BACKGROUND -->
            <section class="option-section">
                <h2 class="section-label">Background</h2>
                <div class="input-tray surface-panel">
                    <div class="choice-group" style="--choice-count: 3;">
                        <button
                            class:selected={appState.background.type === "none"}
                            onclick={() => changeBackgroundType("none")}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                viewBox="-2 -4 24 24"
                                ><title>picture-f</title><path
                                    fill="currentColor"
                                    d="m20 10.536l-4.416-4.44a3 3 0 0 0-4.69.582L5.072 16H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3zm-.011 2.724A3 3 0 0 1 17 16H7.64l4.969-8.293a1 1 0 0 1 1.563-.195zM6 9a3 3 0 1 0 0-6a3 3 0 0 0 0 6"
                                /></svg
                            >
                            None
                        </button>
                        <button
                            class:selected={appState.background.type ===
                                "color"}
                            onclick={() => changeBackgroundType("color")}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                viewBox="-2 -3.5 24 24"
                                ><title>rectangle-f</title><path
                                    fill="currentColor"
                                    d="M3 .565h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3v-10a3 3 0 0 1 3-3"
                                /></svg
                            >
                            Solid/Gradient
                        </button>
                        <button
                            class:selected={appState.background.type ===
                                "image"}
                            onclick={() => changeBackgroundType("image")}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                ><title>image-solid</title><path
                                    fill="currentColor"
                                    fill-rule="evenodd"
                                    d="M7.268 4.658a54.7 54.7 0 0 1 9.465 0l1.51.132a3.14 3.14 0 0 1 2.831 2.66a30.6 30.6 0 0 1 0 9.1q-.061.397-.212.754c-.066.157-.27.181-.386.055l-4.421-4.864a.75.75 0 0 0-.792-.207l-2.531.844l-3.671-4.13A.75.75 0 0 0 7.97 8.97l-4.914 4.914a.246.246 0 0 1-.422-.159a30.6 30.6 0 0 1 .292-6.276a3.14 3.14 0 0 1 2.831-2.66zM14 9a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0"
                                    clip-rule="evenodd"
                                /><path
                                    fill="currentColor"
                                    d="M2.961 16.1a.25.25 0 0 0-.07.21l.035.24a3.14 3.14 0 0 0 2.831 2.66l1.51.131c3.15.274 6.316.274 9.466 0l1.51-.131a3.1 3.1 0 0 0 1.185-.347c.137-.071.16-.252.056-.366l-4.1-4.51a.25.25 0 0 0-.265-.07l-2.382.794a.75.75 0 0 1-.798-.213l-3.295-3.707a.25.25 0 0 0-.364-.01z"
                                /></svg
                            >
                            Unsplash
                        </button>
                    </div>

                    {#if appState.background.type === "image"}
                        <form
                            class="input-field grouped-fields"
                            onsubmit={(e) => {
                                e.preventDefault();
                                if (!disableFetchButton) saveImageQuery();
                            }}
                        >
                            <label for="query"> Topic for the image </label>
                            <div class="input-row">
                                <input
                                    autocorrect="off"
                                    autocomplete="off"
                                    maxlength={24}
                                    id="query"
                                    type="text"
                                    bind:value={queryBind}
                                    placeholder="e.g. nature, city, blue"
                                />
                                <button
                                    type="submit"
                                    class="primary"
                                    disabled={disableFetchButton}
                                >
                                    {isSameAsCached ? "Refresh" : "Search"}
                                </button>
                            </div>
                        </form>
                        <div class="input-field grouped-fields">
                            <span>Refresh Frequency</span>
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
                                            persist();
                                        }}>{freq}</button
                                    >
                                {/each}
                            </div>
                        </div>

                        <div class="hint">
                            You can manually get a new image every few minutes.
                            let the API service rest.
                        </div>
                    {:else if appState.background.type === "color"}
                        <label class="toggle-row">
                            <span>Gradient</span>
                            <input
                                type="checkbox"
                                bind:checked={appState["color-cache"].gradient}
                                onchange={saveColorCache}
                            />
                            <div class="toggle-switch"></div>
                        </label>

                        <div class="color-grid">
                            <div class="color-field">
                                <span class="small">Primary Color</span>
                                <input
                                    type="color"
                                    bind:value={colorBind}
                                    oninput={saveColorCache}
                                />
                            </div>
                            {#if appState["color-cache"].gradient}
                                <div class="color-field">
                                    <span class="small">Secondary Color</span>
                                    <input
                                        type="color"
                                        bind:value={colorBindSecondary}
                                        oninput={saveColorCache}
                                    />
                                </div>
                            {/if}
                        </div>
                    {/if}
                </div>
            </section>

            <footer class="option-section">
                <h2 class="section-label">About</h2>
                <div class="input-tray surface-panel">
                    <p>Designed and developed by Lukas Nabholz.</p>
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
                        by PangramPangram.
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
</style>
