<script lang="ts">
    import { fade, fly } from "svelte/transition";
    import { onMount } from "svelte";

    import {
        appState,
        uiState,
        hydrateState,
        startLoading,
        stopLoading,
        retryFailedWrites,
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

    let myg = $state(true);

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Meta") {
            console.log("Command pressed");

            myg = !myg;
            //uiState.showOnboardAtLaunch = true;
        }
    }

    import { quintIn, quintOut } from "svelte/easing";

    function blur(node: HTMLElement, { duration = 600, reverse = false } = {}) {
        return {
            duration,
            easing: reverse ? quintIn : quintOut,

            css: (t: number) => `
                opacity: ${t};
                filter: blur(${(1 - t) * 5}px);
            `,
        };
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

{#if myg}
    <div
        style="transform: translateY(0px);"
        class:is-onboarding={uiState.showOnboardAtLaunch}
        in:blur
        out:blur={{ reverse: true }}
    >
        <ControlBar />
    </div>
{/if}

{#if uiState.optionsOpen}
    <div id="float-overlay" in:blur={{ reverse: true }} out:blur>
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

<div class="storage-notice" class:visible={uiState.storageError !== null}>
    <p role="status" aria-live="polite" aria-atomic="true">
        {uiState.storageError ?? ""}
    </p>

    {#if uiState.storageError}
        <button type="button" onclick={() => retryFailedWrites()}>
            Retry saving
        </button>
    {/if}
</div>

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

    .is-onboarding {
        pointer-events: none;
        opacity: 0.5;
        filter: grayscale(0.5);
        transition: all var(--duration-moderate) var(--ease-standard);
    }

    .storage-notice {
        position: fixed;
        top: var(--space-05);
        left: 50%;
        transform: translateX(-50%);
        z-index: 2000;

        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--space-03);

        width: max-content;
        max-width: calc(100vw - 2rem);
        box-sizing: border-box;

        color: var(--color-text);
        font-size: var(--font-size-sm);
    }

    .storage-notice.visible {
        padding: var(--space-04);
        background: var(--color-background);
        border: 1px solid var(--color-border-strong);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-md);
    }

    .storage-notice p {
        margin: 0;
        overflow-wrap: anywhere;
    }

    .storage-notice button {
        flex-shrink: 0;
        text-decoration: underline;
    }

    .storage-notice button:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: 3px;
    }
</style>
