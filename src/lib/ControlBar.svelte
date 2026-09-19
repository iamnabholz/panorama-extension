<script lang="ts">
    import { fade, slide } from "svelte/transition";
    import LoaderIndicator from "./components/LoaderIndicator.svelte";
    import { appState, persist, uiState } from "./state.svelte";

    $effect(() => {
        document.body.classList.toggle(
            "focused",
            appState.sentenceVisible || uiState.optionsOpen,
        );
    });

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
        persist();
    }

    let imageCredit = $derived(
        appState.background.type === "image"
            ? appState["image-cache"]
            : undefined,
    );
</script>

<div id="control-bar">
    <LoaderIndicator />

    <div class="controls glassy">
        {#if imageCredit?.author && imageCredit?.link}
            <div
                class="credits-wrapper"
                transition:slide={{ axis: "x", duration: 200 }}
            >
                <a
                    class="credits-anchor surface-highlight"
                    href={imageCredit.link}
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
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
            >
                {#if uiState.optionsOpen}
                    <path
                        fill="currentColor"
                        fill-rule="evenodd"
                        d="M4 7h8.17a3.001 3.001 0 0 1 5.66 0H20a1 1 0 1 1 0 2h-2.17a3.001 3.001 0 0 1-5.66 0H4a1 1 0 0 1 0-2m0 8h2.17a3.001 3.001 0 0 1 5.66 0H20a1 1 0 1 1 0 2h-8.17a3.001 3.001 0 0 1-5.66 0H4a1 1 0 1 1 0-2"
                        clip-rule="evenodd"
                    />
                {:else}
                    <g fill="none">
                        <circle
                            cx="9"
                            cy="16"
                            r="2"
                            fill="currentColor"
                            opacity=".16"
                        />
                        <circle
                            cx="15"
                            cy="8"
                            r="2"
                            fill="currentColor"
                            opacity=".16"
                        />
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 8h9m4 0h3m-9 8h9M4 16h3"
                        />
                        <circle
                            cx="9"
                            cy="16"
                            r="2"
                            stroke="currentColor"
                            stroke-width="2"
                        />
                        <circle
                            cx="15"
                            cy="8"
                            r="2"
                            stroke="currentColor"
                            stroke-width="2"
                        />
                    </g>
                {/if}
            </svg>
        </button>
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
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
            >
                {#if uiState.sentenceVisible}
                    <path
                        fill="currentColor"
                        fill-rule="evenodd"
                        d="M18 4v3h3a1 1 0 0 1 1 1v10a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1m2 14a1 1 0 1 1-2 0V9h2zM6 8a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1m2 4a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1"
                        clip-rule="evenodd"
                    />
                {:else}
                    <g fill="none">
                        <path
                            fill="currentColor"
                            d="M3 4h14v16H5a2 2 0 0 1-2-2z"
                            opacity=".16"
                        />
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 4v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8h-4"
                        />
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 4h14v14a2 2 0 0 0 2 2v0M13 8H7m6 4H9"
                        />
                    </g>
                {/if}
            </svg>
        </button>
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
        color: var(--color-text-secondary);
        font-size: 0.85em;
    }

    .controls svg {
        height: 1.2em;
        width: max-content;
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

    button {
        padding-inline: var(--space-04);
    }

    button:active {
        transform: scale(1.1);
    }
</style>
