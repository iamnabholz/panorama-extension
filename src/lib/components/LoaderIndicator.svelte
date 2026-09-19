<script lang="ts">
    import { slide } from "svelte/transition";
    import { uiState } from "../state.svelte";
</script>

{#if uiState.loadingData.length > 0}
    <div class="loader-wrapper" transition:slide={{ axis: "x", duration: 200 }}>
        <div class="glassy loader">
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
        height: 2.6rem;
        width: 2.6rem;

        flex-shrink: 0;
    }

    .loader {
        display: flex;
        align-items: center;
        justify-content: center;

        width: 2.6em;
        height: 100%;

        padding: 0.6rem;
        box-sizing: border-box;
        border-radius: var(--radius-full);

        flex-shrink: 0;
    }

    .spinner {
        width: 100%;
        height: 100%;

        flex-shrink: 0;

        border: 3px solid transparent;
        border-left-color: var(--color-text);
        border-radius: 50%;
        opacity: 0.8;

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
