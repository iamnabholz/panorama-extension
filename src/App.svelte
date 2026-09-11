<script lang="ts">
    import { fade, fly } from "svelte/transition";
    import { onMount } from "svelte";

    import {
        appState,
        uiState,
        hydrateState,
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
    import Onboard from "./lib/Onboard.svelte";

    let mounted = $state(false);
    let ready = $derived(mounted && uiState.sentenceVisible);

    onMount(() => {
        const loadId = startLoading();
        hydrateState()
            .then(() => {
                fetchHolidays();
                if (appState.displayWeather) fetchWeather();
                if (appState.background.type === "image")
                    checkBackgroundCache();
            })
            .catch((err) => console.error("Startup hydration failed:", err))
            .finally(() => {
                stopLoading(loadId);
                mounted = true;
            });
    });
</script>

<div id="viewport">
    {#if ready}
        <span transition:fade>
            <Holiday />
        </span>
    {/if}
    {#if ready && appState.displayGreeting}
        <span in:fly={{ y: 120 }} out:fly={{ delay: 60, y: 120 }}>
            <Greeting />
        </span>
    {/if}

    {#if ready}
        <div
            class="sentence-row"
            in:fly={{ delay: 60, y: 120 }}
            out:fly={{ y: 120 }}
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
    {/if}
</div>

{#if uiState.optionsOpen}
    <div id="float-overlay" in:fly={{ delay: 60, y: 120 }} out:fly={{ y: 120 }}>
        <Options />
    </div>
{/if}

<div transition:fade>
    <ControlBar />
</div>

{#if uiState.showOnboardAtLaunch}
    <div id="float-overlay" style="margin: 0;" transition:fade>
        <Onboard />
    </div>
{/if}

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

    #float-overlay {
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
</style>
