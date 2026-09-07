<script lang="ts">
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
            This is Panorama 3.0.
            <br /> <br />
            To customize your tab: tap the Options icon on the control bar to change
            your background and more, or tap the eye icon to hide or show your summary.
        </p>
    {:else if currentStep === 1}
        <p style="padding-top: 12px; font-weight: bold;">Interactivity</p>
        <p>
            Click the clock or temperature in your summary to switch units.
            <br /><br />
            Or click on the current date to show information about upcoming holidays
            in your country.
        </p>
    {/if}

    <div class="basic-row" style="align-self: flex-end; gap: 8px;">
        {#if currentStep > 0}
            <button class="glass" onclick={goPrevious}> Back </button>
        {/if}
        <button onclick={goNext}>
            {currentStep === 1 ? "Done" : "Next"}
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
</style>
