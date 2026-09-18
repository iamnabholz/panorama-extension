<script lang="ts">
    import { slide } from "svelte/transition";
    import { uiState } from "../state.svelte";
</script>

{#if uiState.loadingData.length > 0}
    <div class="loader-wrapper" transition:slide={{ axis: "x", duration: 200 }}>
        <div class="glass loader">
            <div
                class="spinner"
                role="status"
                aria-label="Loading information"
            ></div>
        </div>
    </div>
{/if}

<style>
    .loader-wrapper {
        height: 100%;
        width: var(--space-08);

        flex-shrink: 0;
        overflow: hidden;
    }

    .loader {
        display: flex;
        align-items: center;
        justify-content: center;

        width: var(--space-08);
        height: 100%;

        padding: var(--space-03);
        border-radius: var(--radius-full);

        flex-shrink: 0;
    }

    .spinner {
        width: 100%;
        height: 100%;

        flex-shrink: 0;

        border: 3px solid transparent;
        border-left-color: var(--color-text-secondary);
        border-radius: 50%;

        animation: spinner 1s linear infinite;
    }

    @keyframes spinner {
        to {
            transform: rotate(360deg);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .spinner {
            animation-duration: 4s;
        }
    }
</style>
