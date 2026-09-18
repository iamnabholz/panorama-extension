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

    <div class="glass controls">
        {#if imageCredit?.author && imageCredit?.link}
            <div
                class="credits-wrapper"
                transition:slide={{ axis: "x", duration: 200 }}
            >
                <a
                    class="credits-anchor"
                    href={imageCredit.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    transition:fade={{ duration: 150 }}
                >
                    <b>{imageCredit.author}</b>
                    <span>On Unsplash</span>
                </a>
            </div>
        {/if}

        <button
            id="options-toggle"
            type="button"
            class:active={uiState.optionsOpen}
            onclick={toggleOptions}
            aria-expanded={uiState.optionsOpen}
            aria-label={uiState.optionsOpen ? "Hide options" : "Show options"}
            title={uiState.optionsOpen ? "Hide options" : "Show options"}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
            >
                <path
                    d="M10 22H6v-2h4v2Zm-4-2H4v-2H2v-2h2v-2h2v6Zm6-4h10v2H12v2h-2v-6h2v2Zm-2-2H6v-2h4v2Zm8-2h-4v-2h4v2Zm-6-4H2V6h10V4h2v6h-2V8Zm8-2h2v2h-2v2h-2V4h2v2Zm-2-2h-4V2h4v2Z"
                />
            </svg>
        </button>
        <button
            type="button"
            onclick={toggleVisibility}
            aria-pressed={uiState.sentenceVisible}
            aria-label={uiState.sentenceVisible
                ? "Hide information"
                : "Show information"}
            title={uiState.sentenceVisible
                ? "Hide information."
                : "Show information."}
        >
            {#if uiState.sentenceVisible}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                >
                    <path
                        d="M22 22h-2v-2h2v2Zm-6-2H8v-2h8v2Zm4 0h-2v-2h2v2ZM8 18H4v-2h4v2Zm10 0h-2v-2h2v2ZM4 16H2v-2h2v2Zm6-6h2v2h2v2h2v2h-6v-2H8V8h2v2Zm12 6h-2v-2h2v2ZM2 14H0v-4h2v4Zm22 0h-2v-4h2v4Zm-8-2h-2v-2h2v2ZM4 10H2V8h2v2Zm10 0h-2V8h2v2Zm8 0h-2V8h2v2ZM6 6h2v2H4V4h2v2Zm14 2h-4V6h4v2Zm-4-2h-6V4h6v2ZM4 4H2V2h2v2Z"
                    />
                </svg>
            {:else}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                >
                    <path
                        d="M16 20H8v-2h8v2Zm-8-2H4v-2h4v2Zm12 0h-4v-2h4v2ZM4 16H2v-2h2v2Zm10-6h-2v2h2v-2h2v4h-2v2h-4v-2H8v-4h2V8h4v2Zm8 6h-2v-2h2v2ZM2 14H0v-4h2v4Zm22 0h-2v-4h2v4ZM4 10H2V8h2v2Zm18 0h-2V8h2v2ZM8 8H4V6h4v2Zm12 0h-4V6h4v2Zm-4-2H8V4h8v2Z"
                    />
                </svg>
            {/if}
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

        height: var(--space-08);

        z-index: 10;
    }

    .controls {
        display: flex;
        align-items: stretch;

        height: 100%;
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

        padding-top: 3px;
        padding-inline: var(--space-04) var(--space-05);

        color: var(--color-text-secondary);
        font-weight: var(--font-weight-regular);
        font-size: var(--font-size-xs);
        line-height: 1;
    }

    .credits-anchor b {
        color: var(--color-text);
        font-weight: var(--font-weight-bold);
    }

    .credits-anchor span {
        font-size: 0.85em;
    }

    #control-bar svg {
        height: 90%;
        width: max-content;
        display: block;
    }

    a,
    button {
        cursor: pointer;

        border-radius: var(--radius-full);
        color: inherit;
        text-decoration: none;

        background: transparent;
        transition: background-color 150ms ease-out;
    }

    button {
        padding: var(--space-02) var(--space-03);
    }

    a:hover,
    button.active,
    button:hover {
        background: rgba(255, 255, 255, 0.15);
    }
</style>
