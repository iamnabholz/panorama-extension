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

<div id="float-panel" class="glassy">
    <div id="float-panel__scroll">
        <div class="options-layout">
            <header class="options-header">
                <div class="brand">
                    <div class="brand-title">
                        <h1>Panorama</h1>
                        <span class="version">v{pkg.version}</span>
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
                <div class="input-tray">
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
                            class="input-row"
                            class:is-disabled={!appState.displayGreeting}
                        >
                            <input
                                type="text"
                                bind:value={appState.userName}
                                placeholder="Your name..."
                                disabled={!appState.displayGreeting}
                            />
                            <button
                                class="primary"
                                onclick={persist}
                                disabled={!appState.displayGreeting}
                                >Save</button
                            >
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
                            Click the temperature widget to toggle between C/F.
                        </p>
                    </div>
                </div>
            </section>

            <!-- SECTION: BACKGROUND -->
            <section class="option-section">
                <h2 class="section-label">Background</h2>
                <div class="input-tray">
                    <div class="choice-group">
                        <button
                            class:selected={appState.background.type ===
                                "image"}
                            onclick={() => changeBackgroundType("image")}
                        >
                            <svg viewBox="0 0 256 256" fill="currentColor">
                                <path
                                    d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM216,200H40V157.33l37.33-37.33a16,16,0,0,1,22.67,0L128,148l29.33-29.33a16,16,0,0,1,22.67,0L216,156ZM156,100a12,12,0,1,1,12,12A12,12,0,0,1,156,100Z"
                                />
                            </svg>
                            Unsplash
                        </button>
                        <button
                            class:selected={appState.background.type ===
                                "color"}
                            onclick={() => changeBackgroundType("color")}
                        >
                            <svg viewBox="0 0 256 256" fill="currentColor">
                                <path
                                    d="M174.69,211.31a8,8,0,0,1,0-11.31l12-12a56,56,0,0,0,0-79.19l-42.34,42.34a8,8,0,0,1-11.32,0l-16-16a8,8,0,0,1,0-11.32l42.34-42.34a56,56,0,0,0-79.2,0l-12,12a8,8,0,0,1-11.31-11.31l12-12a72,72,0,0,1,101.82,0L222.06,123.4a72,72,0,0,1,0,101.82,8,8,0,0,1-11.31,0ZM118.06,143.9a8,8,0,0,0-11.32,0L64.4,186.24a56,56,0,0,1-79.2-79.2l12-12A8,8,0,0,0,11.31,83.73l-12,12a72,72,0,0,0,101.82,101.82l42.34-42.34a8,8,0,0,0,0-11.31Z"
                                />
                            </svg>
                            Solid/Gradient
                        </button>
                    </div>

                    {#if appState.background.type === "image"}
                        <div class="input-row">
                            <input
                                type="text"
                                bind:value={queryBind}
                                placeholder="Topic (e.g. nature, city)"
                            />
                            <button
                                class="primary"
                                disabled={disableFetchButton}
                                onclick={saveImageQuery}
                            >
                                {isSameAsCached ? "Refresh" : "Search"}
                            </button>
                        </div>
                        <div>
                            <span class="small">Refresh Frequency</span>
                            <div class="choice-group small">
                                {#each ["never", "hourly", "daily"] as freq}
                                    <button
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
                    {:else}
                        <label class="toggle-row">
                            <span>Gradient Enabled</span>
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

            <footer class="option-section footer">
                <h2 class="section-label">About</h2>
                <div class="input-tray small">
                    <div class="link-grid">
                        <a
                            href="https://github.com/iamnabholz/panorama-extension"
                            target="_blank">Source Code</a
                        >
                        <a
                            href="https://nabholz.notion.site/Panorama-Tab-Privacy-Policy-3cc1169905be80589a79cdba1840f806"
                            target="_blank">Privacy Policy</a
                        >
                    </div>
                    <p class="credits">
                        Crafted by Lukas Nabholz. Backgrounds by Unsplash.
                        Weather by OpenWeatherMap. Font by PangramPangram.
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
        opacity: 0.4;
        font-weight: 800;
    }
    .author {
        font-size: var(--font-size-sm);
        margin-top: var(--space-01);
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
    .input-row.is-disabled {
        opacity: 0.3;
        pointer-events: none;
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
    .link-grid {
        display: flex;
        gap: var(--space-06);
    }
    .credits {
        line-height: 1.4;
    }
</style>
