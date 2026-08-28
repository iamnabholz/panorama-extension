<script>
    import { uiState } from "../state.svelte";
</script>

{#if uiState.loadingData.length > 0}
    <div class="spinner"></div>
{/if}

<style>
    @keyframes spinner {
        to {
            transform: rotate(360deg);
        }
    }
    .spinner {
        position: relative;
        width: 24px;
        height: 24px;

        margin-left: 4px;
        border-radius: 50%;
        border: 4px solid transparent;
        border-bottom-color: currentColor;
        animation: spinner 1s ease infinite;
    }
</style>
