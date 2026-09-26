<script lang="ts">
    import Clock from "./Clock.svelte";
    import { uiState } from "./state.svelte";
    import { slide, fade } from "svelte/transition";

    let currentStep = $state(0);
    const totalSteps = 3;

    function completeOnboard() {
        uiState.showOnboardAtLaunch = false;
    }

    function goNext() {
        if (currentStep === totalSteps - 1) {
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

<div class="onboard-overlay" transition:fade={{ duration: 200 }}>
    <div id="float-panel" class="onboard-card">
        <div id="float-panel__scroll">
            <div class="step-content">
                {#if currentStep === 0}
                    <div transition:slide|local={{ duration: 150 }}>
                        <h2>Welcome to Panorama</h2>
                        <p>
                            Transform your new tab into a simple, beautiful
                            summary.
                        </p>
                        <div class="preview-box">
                            <div class="mock-ui">
                                <div class="mock-dot red"></div>
                                <div class="mock-dot yellow"></div>
                                <div class="mock-dot green"></div>
                            </div>

                            <span class="mock-text"> hello </span>
                        </div>
                    </div>
                {:else if currentStep === 1}
                    <div transition:slide|local={{ duration: 150 }}>
                        <h2>Make it yours</h2>
                        <p>
                            Use the <b>Settings</b> icon located on the control bar
                            at the bottom of your screen to change backgrounds, toggle
                            widgets, or set your name for a personal greeting.
                        </p>
                        <div class="icon-instruction">
                            <div class="instruction-row">
                                <div class="icon-circle">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 32 32"
                                        aria-hidden="true"
                                        focusable="false"
                                    >
                                        <path
                                            d="M7 11a1 1 0 0 1 0-2h18a1 1 0 0 1 0 2zm0 11a1 1 0 0 1 0-2h18a1 1 0 0 1 0 2z"
                                        />

                                        <circle
                                            class="dot dot-top"
                                            cx="22"
                                            cy="10"
                                            r="4"
                                        />

                                        <circle
                                            class="dot dot-bottom"
                                            cx="10"
                                            cy="21"
                                            r="4"
                                        />
                                    </svg>
                                </div>
                                <span>Customize the experience</span>
                            </div>
                            <div class="instruction-row">
                                <div class="icon-circle">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        xml:space="preserve"
                                        fill-rule="evenodd"
                                        stroke-linejoin="round"
                                        stroke-miterlimit="2"
                                        clip-rule="evenodd"
                                        viewBox="0 0 32 32"
                                        aria-hidden="true"
                                        focusable="false"
                                    >
                                        <path
                                            fill-opacity="1"
                                            d="M24.81 7.2A3.2 3.2 0 0 1 28 10.37v11.24a3.2 3.2 0 0 1-3.19 3.19H7.2A3.2 3.2 0 0 1 4 21.6V10.39A3.2 3.2 0 0 1 7.19 7.2zM10.5 15h11a1 1 0 0 0 0-2h-11a1 1 0 0 0 0 2m2 4.5h7a1 1 0 0 0 0-2h-7a1 1 0 0 0 0 2"
                                        />
                                        <path
                                            d="M24.81 6.2A4.2 4.2 0 0 1 29 10.37v11.24a4.2 4.2 0 0 1-4.19 4.19H7.2A4.2 4.2 0 0 1 3 21.6V10.39A4.2 4.2 0 0 1 7.19 6.2zm0 2H7.2c-1.21 0-2.2.96-2.2 2.17v11.24c0 1.2.98 2.19 2.19 2.19H24.8a2.2 2.2 0 0 0 2.19-2.2V10.39A2.2 2.2 0 0 0 24.8 8.2"
                                        />
                                        <path
                                            fill-opacity="0"
                                            d="M10.5 15a1 1 0 0 1 0-2h11a1 1 0 0 1 0 2zm2 4.5a1 1 0 0 1 0-2h7a1 1 0 0 1 0 2z"
                                        />
                                    </svg>
                                </div>
                                <span>Show or hide the interface</span>
                            </div>
                        </div>
                    </div>
                {:else if currentStep === 2}
                    <div transition:slide|local={{ duration: 150 }}>
                        <h2>Pick your preferences</h2>
                        <p>
                            Click on widgets to interact with them. You can
                            toggle units, view upcoming holidays, or check the
                            local weather.
                        </p>
                        <div class="clock-preview">
                            <span style="font-size: var(--font-size-summary);">
                                <Clock />
                            </span>
                            <span class="hint">Click to toggle format</span>
                        </div>
                    </div>
                {/if}
            </div>

            <footer class="onboard-footer">
                {#if currentStep > 0}
                    <button class="secondary-btn" onclick={goPrevious}
                        >Back</button
                    >
                {/if}
                <button class="primary-btn" onclick={goNext}>
                    {currentStep === totalSteps - 1
                        ? "Start using Panorama"
                        : "Continue"}
                </button>
            </footer>
        </div>
    </div>
</div>

<style>
    .onboard-overlay {
        position: fixed;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }

    .onboard-card {
        width: min(440px, 95vw);
        height: auto;
        padding: var(--space-02);
        background-color: var(--color-background);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-xl);
    }

    .step-content {
        padding-top: var(--space-03);
        min-height: 240px;
        display: flex;
        flex-direction: column;
    }

    h2 {
        font-size: var(--font-size-2xl);
        margin-bottom: var(--space-03);
    }

    p {
        color: var(--color-text-secondary);
        margin-bottom: var(--space-06);
    }

    .preview-box {
        height: 120px;
        border-radius: var(--radius-md);
        display: flex;
        align-items: flex-start;
        padding: var(--space-04);
        border: 1px solid var(--color-border);

        position: relative;
        background: var(--background-value);
        background-size: cover;
        background-repeat: no-repeat;
    }

    .preview-box::before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: var(--color-background-panel);
        z-index: 1;
    }

    .mock-ui {
        display: flex;
        gap: 6px;
        z-index: 2;
    }

    .mock-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
    }
    .red {
        background: var(--color-red);
    }
    .yellow {
        background: var(--color-yellow);
    }
    .green {
        background: var(--color-green);
    }

    .mock-text {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;

        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;

        font-size: var(--font-size-4xl);
        font-weight: var(--font-weight-bold);
        text-transform: capitalize;

        color: var(--color-text-summary);
        opacity: 0.8;
    }

    .icon-instruction {
        display: flex;
        flex-direction: column;
        gap: var(--space-04);
    }

    .instruction-row {
        display: flex;
        align-items: center;
        gap: var(--space-04);
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-bold);
    }

    .icon-circle {
        width: 40px;
        height: 40px;
        background: var(--color-background-elevated);
        padding: var(--space-03);
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-text);
        border: 1px solid var(--color-border);
    }

    .clock-preview {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-02);
        padding: var(--space-04);
        background: var(--color-background-panel);
        border-radius: var(--radius-md);
    }

    .onboard-footer {
        display: flex;
        gap: var(--space-03);
        margin-top: var(--space-04);
    }

    button {
        flex: 1;
        padding: var(--space-04);
        border-radius: var(--radius-md);
        font-weight: var(--font-weight-bold);
        text-align: center;
        transition: all var(--duration-fast) var(--ease-standard);
        cursor: pointer;
        font-family: var(--font-sans);
    }

    .primary-btn {
        background: var(--color-accent);
        color: var(--color-white);
        border: none;
    }

    .primary-btn:hover {
        background: var(--color-accent-hover);
        box-shadow: var(--shadow-md);
    }

    .secondary-btn {
        background: var(--color-background-elevated);
        color: var(--color-text);
        border: 1px solid var(--color-border);
    }

    .secondary-btn:hover {
        border-color: var(--color-border-strong);
        background: var(--color-background-panel);
    }

    .hint {
        font-size: var(--font-size-xs);
        color: var(--color-text-secondary);
        font-weight: normal;
    }
</style>
