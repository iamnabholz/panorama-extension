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
    <div id="float-panel" class="surface onboard-card">
        <div id="float-panel__scroll">
            <div class="step-content">
                {#if currentStep === 0}
                    <div transition:fade={{ duration: 150 }}>
                        <h2>Welcome to Panorama</h2>
                        <p>
                            Transform your new tab into a focused, beautiful
                            dashboard. Everything you see is customizable to fit
                            your workflow.
                        </p>
                        <div class="preview-box surface-panel">
                            <div class="mock-ui">
                                <div class="mock-dot red"></div>
                                <div class="mock-dot yellow"></div>
                                <div class="mock-dot green"></div>
                            </div>
                        </div>
                    </div>
                {:else if currentStep === 1}
                    <div transition:fade={{ duration: 150 }}>
                        <h2>Make it yours</h2>
                        <p>
                            Use the <b>Settings</b> icon on the bottom left to change
                            backgrounds, toggle widgets, or set your name for a personal
                            greeting.
                        </p>
                        <div class="icon-instruction">
                            <div class="instruction-row">
                                <div class="icon-circle">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                        focusable="false"
                                    >
                                        <path
                                            fill="currentColor"
                                            fill-rule="evenodd"
                                            d="M4 7h8.17a3.001 3.001 0 0 1 5.66 0H20a1 1 0 1 1 0 2h-2.17a3.001 3.001 0 0 1-5.66 0H4a1 1 0 0 1 0-2m0 8h2.17a3.001 3.001 0 0 1 5.66 0H20a1 1 0 1 1 0 2h-8.17a3.001 3.001 0 0 1-5.66 0H4a1 1 0 1 1 0-2"
                                            clip-rule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <span>Customize your dashboard</span>
                            </div>
                            <div class="instruction-row">
                                <div class="icon-circle">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                        focusable="false"
                                    >
                                        <path
                                            fill="currentColor"
                                            fill-rule="evenodd"
                                            d="M18 4v3h3a1 1 0 0 1 1 1v10a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1m2 14a1 1 0 1 1-2 0V9h2zM6 8a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1m2 4a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1"
                                            clip-rule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <span>Show or hide the interface</span>
                            </div>
                        </div>
                    </div>
                {:else if currentStep === 2}
                    <div transition:fade={{ duration: 150 }}>
                        <h2>Stay Informed</h2>
                        <p>
                            Click on widgets to interact with them. You can
                            toggle units, view upcoming holidays, or check the
                            local weather.
                        </p>
                        <div class="clock-preview">
                            <Clock />
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
        background-color: rgba(0, 0, 0, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        backdrop-filter: blur(4px);
    }

    .onboard-card {
        width: min(440px, 95vw);
        height: auto;
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
    }

    .mock-ui {
        display: flex;
        gap: 6px;
    }

    .mock-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        opacity: 0.5;
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
        transform: translateY(-1px);
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
