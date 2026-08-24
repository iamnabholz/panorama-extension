<script lang="ts">
    import { fly, slide } from "svelte/transition";
    import { appState, setState } from "./state.svelte";

    $effect(() => {
        document.documentElement.style.setProperty(
            "--bg-blur",
            appState.sentenceVisible || appState.optionsOpen ? "4px" : "0px",
        );
    });

    let lastVisibilitySetting = appState.sentenceVisible;

    function toggleOptions() {
        if (appState.optionsOpen) {
            appState.sentenceVisible = lastVisibilitySetting;
            appState.optionsOpen = false;
        } else {
            lastVisibilitySetting = appState.sentenceVisible;

            appState.sentenceVisible = false;
            appState.optionsOpen = true;
        }
    }

    function toggleVisibility() {
        if (appState.optionsOpen) {
            appState.optionsOpen = false;
        }

        setState("sentenceVisible", !appState.sentenceVisible);
    }

    function handleKeydown(event: KeyboardEvent, action: () => void) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            action();
        }
    }
</script>

<div id="control-bar">
    {#if appState.backgroundType == "image"}
        <a class="credits-anchor" href="/">
            <span style="display: contents; ">
                <span style="font-size: 0.8em; ">Maria Maria</span>
                <span style="font-size: 0.6em;">On Unsplash</span>
            </span>
        </a>
    {/if}
    <button
        id="options-toggle"
        type="button"
        class:active={appState.optionsOpen}
        onclick={toggleOptions}
        onkeydown={(e) => handleKeydown(e, toggleOptions)}
        title="Show options."
        aria-label="Show options."
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                d="M10 22H6v-2h4v2Zm-4-2H4v-2H2v-2h2v-2h2v6Zm6-4h10v2H12v2h-2v-6h2v2Zm-2-2H6v-2h4v2Zm8-2h-4v-2h4v2Zm-6-4H2V6h10V4h2v6h-2V8Zm8-2h2v2h-2v2h-2V4h2v2Zm-2-2h-4V2h4v2Z"
            />
        </svg>
        {#if appState.optionsOpen}
            <label transition:slide={{ axis: "x" }} for="options-toggle">
                Options
            </label>
        {/if}
    </button>
    <button
        type="button"
        onclick={toggleVisibility}
        onkeydown={(e) => handleKeydown(e, toggleVisibility)}
        title={appState.sentenceVisible
            ? "Hide information."
            : "Show information."}
        aria-label={appState.sentenceVisible
            ? "Hide information"
            : "Show information"}
    >
        {#if appState.sentenceVisible}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
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
        position: absolute;
        bottom: 4em;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 100px;
        display: flex;
        gap: 4px;
        padding: 4px;
        align-items: center;
        justify-content: center;
        transition: 150ms ease-out;

        /* From https://css.glass */
        background: rgba(255, 255, 255, 0.05);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        border: 1px solid rgba(255, 255, 255, 0.1);

        color: white;
    }

    #control-bar svg {
        height: 20px;
        width: 20px;
        display: block;
    }

    a {
        all: unset;
    }

    .credits-anchor {
        flex-direction: column;
        line-height: 1.2;
        padding: 0 16px 0 14px;
        align-items: flex-start;
    }

    a,
    button {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0px;
        height: 40px;

        padding: 0px 10px;
        border-radius: 100px;
        color: inherit;

        background: rgba(255, 255, 255, 0);
        border: 1px solid rgba(255, 255, 255, 0);
        transition: 150ms ease-out;
    }

    a:hover,
    button.active,
    button:hover {
        background: rgba(255, 255, 255, 0.15);
        border-color: rgba(255, 255, 255, 0.1);
    }

    label {
        display: grid;
        grid-template-columns: 1fr;
        overflow: hidden;
        transition: grid-template-columns 200ms ease-out;

        min-width: 0;
        white-space: nowrap;

        cursor: inherit;
        padding: 0 6px 0 9px;
    }
</style>
