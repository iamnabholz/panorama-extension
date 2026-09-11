<script lang="ts">
    import Clock from "./Clock.svelte";
    import { uiState } from "./state.svelte";

    let currentStep = $state(0);

    function completeOnboard() {
        uiState.showOnboardAtLaunch = false;
    }

    function goNext() {
        if (currentStep === 1) {
            completeOnboard();
            return;
        }
        currentStep = currentStep + 1;
    }
    function goPrevious() {
        if (currentStep === 0) return;
        currentStep = currentStep - 1;
    }
</script>

<div class="bg"></div>
<div id="float-panel" class="glass">
    {#if currentStep === 0}
        <p style="padding-top: 12px; font-weight: bold;">Welcome</p>
        <p>
            Change the background, and customize items from the summary by
            opening the options panel with the left icon.
            <br /> <br />
            Show or hide the summary by clicking the eye icon on the right.
        </p>

        <div class="row glass bar-row">
            <div class="bar-button">
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
            </div>
            <div class="bar-button">
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
            </div>
        </div>
    {:else if currentStep === 1}
        <p style="padding-top: 12px; font-weight: bold;">Interactivity</p>
        <p>
            Click the clock or temperature in your summary to switch units.
            <br /> <br />
            Or click on the current date to show information about upcoming holidays
            in your country.
            <br /> <br />
        </p>

        <div class="summary-clock">
            <Clock />
        </div>
    {/if}

    <div class="basic-row" style="align-self: flex-end; gap: 8px;">
        {#if currentStep > 0}
            <button class="glass" onclick={goPrevious}> Back </button>
        {/if}
        <button onclick={goNext}>
            {currentStep === 1 ? "Finish" : "Next"}
        </button>
    </div>
</div>

<style>
    #float-panel {
        height: min-content;
        z-index: 10;
    }

    button:hover:not(:disabled),
    button:focus-visible:not(:disabled) {
        outline: 2px solid var(--color-white);
        outline-offset: 2px;
    }

    button {
        cursor: pointer;
        padding: 8px 16px;
        border: none;
        color: inherit;
        font: inherit;
        background-color: var(--color-white);
        color: var(--color-black);
        border-radius: var(--field-radius-md);
        transition: var(--field-transition);
    }
    button:disabled {
        background-color: var(--white-60);
        cursor: not-allowed;
    }
    .bg {
        position: absolute;
        background-color: black;
        width: 100dvw;
        height: 100dvh;
        opacity: 0.4;
        z-index: 5;
    }

    .bar-row {
        display: flex;
        align-self: center;
        align-items: center;
        width: fit-content;
        border-radius: 100px;
        padding: 4px;
    }

    .bar-button {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 22px;
        height: 32px;
        width: fit-content;

        border-radius: 100px;
        color: inherit;

        background: transparent;
        transition:
            background-color 150ms ease-out,
            outline-color 150ms ease-out;
    }

    .bar-button:hover,
    .bar-button:focus-visible {
        background: rgba(255, 255, 255, 0.15);
    }

    .bar-button svg {
        height: 24px;
        width: 24px;
        display: block;

        filter: drop-shadow(0 0 6px rgba(0, 0, 0, 0.2));
    }

    .summary-clock {
        align-self: center;
        font-size: var(--sentence-font-size);
        font-weight: bold;
    }
</style>
