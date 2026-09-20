<script lang="ts">
    import { slide } from "svelte/transition";
    import { uiState } from "../state.svelte";
</script>

{#if uiState.loadingData.length > 0 || uiState.isLoading}
    <div class="loader-wrapper" transition:slide={{ axis: "x", duration: 200 }}>
        <div class="loader-inner">
            <div class="surface loader">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="100%"
                    height="100%"
                    viewBox="0 0 24 24"
                    role="status"
                    aria-label="Loading information"
                >
                    <g>
                        <circle
                            cx="16.75"
                            cy="3.77"
                            r="1.5"
                            fill="currentColor"
                            opacity=".29"
                        />
                        <circle
                            cx="20.23"
                            cy="7.25"
                            r="1.5"
                            fill="currentColor"
                            opacity=".43"
                        />
                        <circle
                            cx="21.5"
                            cy="12"
                            r="1.5"
                            fill="currentColor"
                            opacity=".57"
                        />
                        <circle
                            cx="20.23"
                            cy="16.75"
                            r="1.5"
                            fill="currentColor"
                            opacity=".71"
                        />
                        <circle
                            cx="16.75"
                            cy="20.23"
                            r="1.5"
                            fill="currentColor"
                            opacity=".86"
                        />
                        <circle cx="12" cy="21.5" r="1.5" fill="currentColor" />
                        <animateTransform
                            attributeName="transform"
                            calcMode="discrete"
                            dur="0.75s"
                            repeatCount="indefinite"
                            type="rotate"
                            values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12"
                        />
                    </g>
                </svg>
            </div>
        </div>
    </div>
{/if}

<style>
    .loader-wrapper {
        overflow: hidden;
        flex-shrink: 0;
    }

    .loader-inner {
        display: flex;
        align-items: center;
        height: 2.6rem;
        width: 2.6rem;
        flex-shrink: 0;
    }

    .loader {
        display: flex;
        align-items: center;
        justify-content: center;

        height: 2.6rem;
        width: 2.6rem;
        padding: 0.4rem;
        box-sizing: border-box;
        border-radius: var(--radius-full);

        flex-shrink: 0;
    }
</style>
