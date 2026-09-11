<script>
    import { fade } from "svelte/transition";
    import { uiState } from "../state.svelte";
</script>

{#if uiState.loadingData.length > 0}
    <div
        transition:fade
        class="glass"
        aria-label="Loading Information"
        title="Loading Information"
    >
        <div class="spinner"></div>
    </div>
{/if}

<style>
    .glass {
        border-radius: 100px;
        padding: 6px;
    }
    .spinner {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        border: 4px solid transparent;
        border-bottom-color: currentColor;
        animation: spinner 1s linear infinite;
    }

    @keyframes spinner {
        to {
            transform: rotateZ(360deg);
        }
    }
</style>
