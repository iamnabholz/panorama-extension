<div class="spinner"></div>

<style>
    .spinner {
        margin-left: 4px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 4px solid transparent;
        border-bottom-color: currentColor;
        animation: spinner 1s ease infinite;
    }

    @keyframes spinner {
        to {
            transform: rotate(360deg);
        }
    }
</style>
