<script lang="ts">
    import { fade, fly } from "svelte/transition";
    import { onMount } from "svelte";

    import {
        appState,
        uiState,
        hydrateState,
        persist,
        startLoading,
        stopLoading,
    } from "./lib/state.svelte";

    import Holiday from "./lib/Holiday.svelte";
    import Clock from "./lib/Clock.svelte";
    import Greeting from "./lib/Greeting.svelte";
    import Weather from "./lib/Weather.svelte";
    import Temperature from "./lib/Temperature.svelte";

    import Options from "./lib/Options.svelte";
    import ControlBar from "./lib/ControlBar.svelte";
    import { checkBackgroundCache } from "./lib/background";
    import { fetchHolidays } from "./lib/holiday";
    import { fetchWeather } from "./lib/weather";

    let mounted = $state(false);

    onMount(() => {
        const loadId = startLoading();

        hydrateState().then(() => {
            // Fetch everything here for state
            fetchHolidays();

            if (appState.displayWeather) {
                fetchWeather();
            }

            if (appState.background.type === "image") {
                checkBackgroundCache().then((result) => {
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

            stopLoading(loadId);
        });

        requestAnimationFrame(() => {
            mounted = true;
        });
    });
</script>

<div id="viewport">
    <span class:fade={!uiState.sentenceVisible || !mounted}>
        <Holiday />
    </span>
    {#if appState.displayGreeting}
        <span
            class:fade-slide={!uiState.sentenceVisible || !mounted}
            style="transition-delay: {!uiState.sentenceVisible
                ? '60ms'
                : '0ms'}"
        >
            <Greeting />
        </span>
    {/if}

    <div
        class="sentence-row"
        class:fade-slide={!uiState.sentenceVisible || !mounted}
        style="transition-delay: {!uiState.sentenceVisible ? '0ms' : '60ms'}"
    >
        {#if appState.displayTime}
            <p class="faint">It's</p>
            <Clock />
            {#if appState.displayWeather}
                <p class="faint">—</p>
            {/if}
        {/if}
        {#if appState.displayWeather}
            <p class="faint">
                {appState.displayTime ? "currently" : "Currently"}
            </p>
            <Temperature />
            <p class="faint">and</p>
            <Weather />
        {/if}
    </div>
</div>

{#if uiState.optionsOpen}
    <div id="options-overlay" transition:fly={{ y: "80" }}>
        <Options />
    </div>
{/if}

<span transition:fade>
    <ControlBar />
</span>

<style>
    #viewport {
        height: 90%;
        overflow: hidden;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: var(--paragraph-gap);

        margin: 0 auto;
        width: min(640px, 100%);
        padding: 0 12px;

        cursor: default;
        user-select: none;
        -webkit-user-select: none;

        font-size: var(--sentence-font-size);
        font-weight: bold;
        text-shadow: var(--sentence-shadow);

        color: white;
    }

    #options-overlay {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 8%;
    }

    .sentence-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: var(--sentence-gap);
        row-gap: 0;
    }

    #viewport * {
        transition:
            opacity 0.3s ease,
            transform 0.3s ease;
    }

    :global(.fade-slide) {
        opacity: 0;
        transform: translateY(110px);
        pointer-events: none;
    }

    :global(.fade) {
        opacity: 0;
    }

    :global(.faint) {
        opacity: 0.6;
        font-weight: normal;
    }
</style>
