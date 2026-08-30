<script lang="ts">
    import { fade, slide } from "svelte/transition";
    import LoaderIndicator from "./components/LoaderIndicator.svelte";
    import { appState, persist, uiState } from "./state.svelte";

    $effect(() => {
        document.documentElement.style.setProperty(
            "--bg-blur",
            appState.sentenceVisible || uiState.optionsOpen ? "4px" : "0px",
        );

        document.documentElement.style.setProperty(
            "--bg-scale",
            appState.sentenceVisible || uiState.optionsOpen ? "1.02" : "1",
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

<div id="control-bar" class="glass">
    {#if uiState.loadingData.length > 0}
        <span
            transition:slide={{ axis: "x", duration: 200 }}
            style="margin-right: 4px;"
        >
            <span transition:fade={{ duration: 150 }}>
                <LoaderIndicator />
            </span>
        </span>
    {/if}
    {#if imageCredit?.author && imageCredit?.link}
        <span transition:slide={{ axis: "x", duration: 200 }}>
            <a
                class="credits-anchor"
                href={imageCredit.link}
                target="_blank"
                rel="noopener noreferrer"
                transition:fade={{ duration: 150 }}
            >
                <span class="credits-author">{imageCredit.author}</span>
                <span class="credits-source">On Unsplash</span>
            </a>
        </span>
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

<style>
    #control-bar {
        border-radius: 100px;
        position: absolute;
        bottom: min(6%, 4em);
        left: 50%;
        transform: translateX(-50%);

        display: flex;
        gap: 4px;
        padding: 4px;
        align-items: center;
        justify-content: center;

        color: white;
        z-index: 2;
        transition: 150ms ease-out;
    }

    #control-bar svg {
        height: 20px;
        width: 20px;
        display: block;

        filter: drop-shadow(0 0 6px rgba(0, 0, 0, 0.2));
    }

    .credits-anchor {
        font-size: 0.8em;
        padding: 0px 16px 0px 12px;
        border: none;
        flex-direction: column;
        align-items: flex-start;
        white-space: nowrap;
    }

    .credits-author {
        font-weight: normal;
    }

    .credits-source {
        font-size: 0.75em;
        opacity: 0.6;
    }

    a,
    button {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0px;
        height: 32px;

        padding: 0px 10px;
        border-radius: 100px;
        color: inherit;

        background: transparent;
        transition:
            background-color 150ms ease-out,
            outline-color 150ms ease-out;
    }

    a:hover,
    a:focus-visible,
    button.active,
    button:hover,
    button:focus-visible {
        background: rgba(255, 255, 255, 0.15);
    }

    a:focus-visible,
    button:focus-visible {
        outline: 2px solid var(--color-white);
        outline-offset: 2px;
    }
</style>
