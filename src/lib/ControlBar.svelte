<script lang="ts">
    import { fade, slide } from "svelte/transition";
    import LoaderIndicator from "./components/LoaderIndicator.svelte";
    import { appState, persist, uiState } from "./state.svelte";

    function toggleOptions() {
        if (uiState.optionsOpen) {
            uiState.optionsOpen = false;
            uiState.sentenceVisible = appState.sentenceVisible;
        } else {
            uiState.optionsOpen = true;
            uiState.sentenceVisible = false;
        }
    }

    function toggleVisibility() {
        if (uiState.optionsOpen) uiState.optionsOpen = false;

        uiState.sentenceVisible = !uiState.sentenceVisible;
        appState.sentenceVisible = uiState.sentenceVisible;
        persist("sentenceVisible");
    }

    let imageCredit = $derived(
        appState.background.type === "image"
            ? appState["image-cache"]
            : undefined,
    );

    let summaryDisabled = $derived(
        !appState.displayGreeting &&
            !appState.displayDate &&
            !appState.displayTime &&
            !appState.displayWeather,
    );

    $effect(() => {
        if (summaryDisabled) {
            uiState.sentenceVisible = false;
        }
    });
</script>

<div id="control-bar">
    <LoaderIndicator />

    <div class="controls surface">
        {#if imageCredit?.author && imageCredit?.link}
            <div
                class="credits-wrapper"
                transition:slide={{ axis: "x", duration: 200 }}
            >
                <a
                    class="credits-anchor surface-highlight"
                    href={encodeURI(
                        imageCredit.link +
                            "?utm_source=panorama_tab&utm_medium=referral",
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    transition:fade={{ duration: 150 }}
                >
                    {imageCredit.author}
                    <span>On Unsplash</span>
                </a>
            </div>
        {/if}

        <button
            id="options-toggle"
            type="button"
            class:active={uiState.optionsOpen}
            class="surface-highlight"
            class:surface-elevated={uiState.optionsOpen}
            onclick={toggleOptions}
            aria-expanded={uiState.optionsOpen}
            aria-label={uiState.optionsOpen ? "Hide options" : "Show options"}
            title={uiState.optionsOpen ? "Hide options" : "Show options"}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                width="1em"
                height="1em"
                aria-hidden="true"
                focusable="false"
            >
                <path
                    d="M7 11a1 1 0 0 1 0-2h18a1 1 0 0 1 0 2zm0 11a1 1 0 0 1 0-2h18a1 1 0 0 1 0 2z"
                />

                <circle
                    class="dot dot-top"
                    class:open={uiState.optionsOpen}
                    cx="22"
                    cy="10"
                    r="4"
                />

                <circle
                    class="dot dot-bottom"
                    class:open={uiState.optionsOpen}
                    cx="10"
                    cy="21"
                    r="4"
                />
            </svg>
        </button>
        {#if !summaryDisabled}
            <button
                type="button"
                class="surface-highlight"
                class:surface-elevated={uiState.sentenceVisible}
                onclick={toggleVisibility}
                aria-pressed={uiState.sentenceVisible}
                aria-label={uiState.sentenceVisible
                    ? "Hide information"
                    : "Show information"}
                title={uiState.sentenceVisible
                    ? "Hide information."
                    : "Show information."}
                transition:slide={{ axis: "x" }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xml:space="preserve"
                    fill-rule="evenodd"
                    stroke-linejoin="round"
                    stroke-miterlimit="2"
                    clip-rule="evenodd"
                    viewBox="0 0 32 32"
                    width="1em"
                    height="1em"
                    aria-hidden="true"
                    focusable="false"
                >
                    <path
                        fill-opacity={uiState.sentenceVisible ? "1" : ".14"}
                        d="M24.81 7.2A3.2 3.2 0 0 1 28 10.37v11.24a3.2 3.2 0 0 1-3.19 3.19H7.2A3.2 3.2 0 0 1 4 21.6V10.39A3.2 3.2 0 0 1 7.19 7.2zM10.5 15h11a1 1 0 0 0 0-2h-11a1 1 0 0 0 0 2m2 4.5h7a1 1 0 0 0 0-2h-7a1 1 0 0 0 0 2"
                    />
                    <path
                        d="M24.81 6.2A4.2 4.2 0 0 1 29 10.37v11.24a4.2 4.2 0 0 1-4.19 4.19H7.2A4.2 4.2 0 0 1 3 21.6V10.39A4.2 4.2 0 0 1 7.19 6.2zm0 2H7.2c-1.21 0-2.2.96-2.2 2.17v11.24c0 1.2.98 2.19 2.19 2.19H24.8a2.2 2.2 0 0 0 2.19-2.2V10.39A2.2 2.2 0 0 0 24.8 8.2"
                    />
                    <path
                        fill-opacity={uiState.sentenceVisible ? "0" : "1"}
                        d="M10.5 15a1 1 0 0 1 0-2h11a1 1 0 0 1 0 2zm2 4.5a1 1 0 0 1 0-2h7a1 1 0 0 1 0 2z"
                    />
                </svg>
            </button>
        {/if}
    </div>
</div>

<style>
    #control-bar {
        position: fixed;
        bottom: min(8svh, 4em);
        left: 50%;
        transform: translateX(-50%);

        display: flex;
        align-items: center;
        gap: var(--space-02);

        z-index: 10;
    }

    .controls {
        display: flex;
        align-items: stretch;

        height: 2.6rem;
        gap: var(--space-02);
        padding: var(--space-02);

        border-radius: var(--radius-full);

        flex-shrink: 0;
    }

    .credits-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;

        overflow: hidden;
        flex-shrink: 0;
    }

    .credits-anchor {
        display: flex;
        flex-direction: column;
        justify-content: center;

        width: max-content;
        height: 100%;

        flex-shrink: 0;
        white-space: nowrap;

        /* slight adjustment so it looks centered to the eye */
        padding-block-start: 3px;
        padding-inline-start: var(--space-04);
        padding-inline-end: var(--space-06);

        font-size: var(--font-size-xs);
        line-height: 1.2;
    }

    .credits-anchor span {
        color: var(--color-text);
        opacity: 0.7;
        font-size: 0.85em;
    }

    .controls svg {
        height: 1.2em;
        width: 1.2em;
        flex-shrink: 0;
        display: block;
    }

    a,
    button {
        cursor: pointer;

        border-radius: var(--radius-full);
        color: inherit;
        text-decoration: none;

        box-shadow: none;
        transition:
            box-shadow var(--duration-fast) var(--ease-standard),
            backdrop-filter var(--duration-fast) var(--ease-standard);
    }

    button:active {
        transform: scale(1.1);
    }

    /* options panel button transition */
    .dot {
        transition: transform 250ms cubic-bezier(0.22, 1, 0.36, 1);
    }
    .dot-top.open {
        transform: translateX(-12px);
    }

    .dot-bottom.open {
        transform: translateX(12px);
    }
</style>
