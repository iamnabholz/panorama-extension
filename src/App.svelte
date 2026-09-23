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
    import Greeting from "./lib/Greeting.svelte";
    import Sentence from "./lib/components/Sentence.svelte";

    import Options from "./lib/Options.svelte";
    import ControlBar from "./lib/ControlBar.svelte";
    import { checkBackgroundCache } from "./lib/background";
    import { fetchHolidays } from "./lib/holiday";
    import { fetchWeather } from "./lib/weather";
    import Onboard from "./lib/Onboard.svelte";
    import {
        blur,
        reveal,
        settle,
        dismiss,
        springSettle,
    } from "./lib/utils/transitions";

    import { sound } from "./lib/utils/sound";

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

            //uiState.showOnboardAtLaunch = true;
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />

<Background />

<main>
    <div class="summary-wrapper">
        {#if ready && appState.displayDate}
            <span in:settle out:dismiss>
                <Holiday />
            </span>
        {/if}
        {#if ready && appState.displayGreeting}
            <span
                class="text-motion"
                in:springSettle={{ delay: 25 }}
                out:dismiss={{ delay: 25 }}
            >
                <Greeting />
            </span>
        {/if}

        {#if ready}
            <span
                class="text-motion"
                in:springSettle={{ delay: 50 }}
                out:dismiss={{ delay: 50 }}
            >
                <Sentence />
            </span>
        {/if}
    </div>
</main>

<div
    style="transform: translateY(0px);"
    class:is-onboarding={uiState.showOnboardAtLaunch}
    in:blur
    out:blur={{ reverse: true }}
>
    <ControlBar />
</div>

{#if uiState.optionsOpen}
    <div id="float-overlay" in:settle={{ delay: 50 }} out:dismiss>
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

{#if uiState.storageError !== null}
    <div class="storage-notice">
        <p role="status" aria-live="polite" aria-atomic="true">
            {uiState.storageError ?? ""}
        </p>

        {#if uiState.storageError}
            <button type="button" onclick={() => retryFailedWrites()}>
                Retry saving
            </button>
        {/if}
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
        padding-inline: 2rem;
        box-sizing: border-box;
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

    .storage-notice {
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
