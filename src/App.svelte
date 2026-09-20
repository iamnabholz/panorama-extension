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

    import Background from "./lib/Background.svelte";
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

    // Click outside action for Svelte (targets #float-panel)
    function clickOutside(node: HTMLElement, callback: () => void) {
        const handleMousedown = (event: MouseEvent) => {
            const optionsToggle = document.getElementById("options-toggle");
            if (optionsToggle && optionsToggle.contains(event.target as Node)) {
                return;
            }

            if (node && !node.contains(event.target as Node)) {
                callback();
            }
        };

        document.addEventListener("mousedown", handleMousedown, true);

        return {
            destroy() {
                document.removeEventListener(
                    "mousedown",
                    handleMousedown,
                    true,
                );
            },
        };
    }

    function closeOptions() {
        uiState.optionsOpen = false;
        uiState.sentenceVisible = appState.sentenceVisible;
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Meta") {
            console.log("Command pressed");
            // trigger your action here
            uiState.isLoading = !uiState.isLoading;
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />

<Background />

<main>
    <div class="summary-wrapper">
        {#if ready && appState.displayDate}
            <span transition:fade>
                <Holiday />
            </span>
        {/if}
        {#if ready && appState.displayGreeting}
            <span in:fly={{ y: 25 }} out:fly={{ delay: 60, y: 25 }}>
                <Greeting />
            </span>
        {/if}

        {#if ready}
            <p
                class="summary-row"
                in:fly={{ delay: 60, y: 25 }}
                out:fly={{ y: 25 }}
            >
                {#if appState.displayTime}
                    It's
                    <Clock />
                    {#if appState.displayWeather}—{/if}
                {/if}
                {#if appState.displayWeather}
                    {appState.displayTime ? "currently" : "Currently"}
                    <Temperature />
                    and
                    <Weather />
                {/if}
            </p>
        {/if}
    </div>
</main>

<div transition:fade>
    <ControlBar />
</div>

{#if uiState.optionsOpen}
    <div id="float-overlay" in:fly={{ delay: 60, y: 25 }} out:fly={{ y: 25 }}>
        <div use:clickOutside={closeOptions} style="display: contents;">
            <Options />
        </div>
    </div>
{/if}

{#if uiState.showOnboardAtLaunch}
    <div id="float-overlay" style="margin: 0;" transition:fade>
        <Onboard />
    </div>
{/if}

<style>
    main {
        height: 100svh;
        overflow: hidden;

        display: grid;
        align-items: center;
        justify-content: center;

        padding-bottom: 12svh;
        margin: 0 auto;
    }

    .summary-wrapper {
        cursor: default;
        user-select: none;
        -webkit-user-select: none;

        color: var(--color-text-summary-muted);
        font-size: var(--font-size-summary);
        text-shadow: var(--shadow-sentence);

        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.2em;
        text-align: center;

        width: 100%;
        max-width: min(
            900px,
            92vw
        ); /* Adjust this max-width and watch it fluidly reflow! */
        padding-inline: 2rem;
        box-sizing: border-box;
    }

    .summary-row {
        display: inline; /* Treats the entire block like a fluid paragraph */
        text-align: center;
        text-wrap: balance; /* Automatically balances line lengths nicely */
        line-height: 1.4;
        font-weight: var(--font-weight-regular);
        width: 100%;
    }
</style>
