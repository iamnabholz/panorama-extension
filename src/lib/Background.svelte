<script lang="ts">
    import { untrack } from "svelte";
    import { appState, uiState } from "./state.svelte";
    import { isDarkBackground } from "./utils/contrast";

    let currentBg = $derived(
        appState.background.type === "image"
            ? `url("${appState.background.value}")`
            : appState.background.type === "color"
              ? appState.background.value
              : "none",
    );

    let backgroundColor = $derived(
        appState.background.type === "none"
            ? "var(--color-body-background)"
            : "var(--background-color)",
    );

    // Automatically compute and apply contrast whenever background changes
    $effect(() => {
        let sampleColor = "";

        if (appState.background.type === "image") {
            // Unsplash API provides a dominant hex color in appState["image-cache"]?.color
            sampleColor = appState["image-cache"]?.color ?? "#ffffff";
        } else if (appState.background.type === "color") {
            sampleColor = appState["color-cache"].startColor;
        } else {
            const probe = document.createElement("span");
            probe.style.cssText = `
                position: absolute;
                visibility: hidden;
                pointer-events: none;
                background-color: var(--background-color);
            `;

            document.documentElement.appendChild(probe);
            sampleColor = getComputedStyle(probe).backgroundColor;
            probe.remove();
        }

        const isDark = isDarkBackground(sampleColor);

        if (isDark) {
            document.documentElement.setAttribute(
                "data-contrast",
                "light-text",
            );
        } else {
            document.documentElement.removeAttribute("data-contrast");
        }
    });

    let currentBlurredBg = $derived(
        appState.background.type === "image" &&
            appState["image-cache"]?.url === appState.background.value &&
            appState["image-cache"]?.blurredUrl
            ? `url("${appState["image-cache"].blurredUrl}")`
            : currentBg,
    );

    let activeBg = $state(untrack(() => currentBg));
    let stagingBg = $state(untrack(() => currentBg));
    let activeBlurredBg = $state(untrack(() => currentBlurredBg));
    let stagingBlurredBg = $state(untrack(() => currentBlurredBg));
    let isFading = $state(false);

    $effect(() => {
        const nextBg = currentBg;
        const nextBlurredBg = currentBlurredBg;

        const unchanged = untrack(
            () => nextBg === activeBg && nextBlurredBg === activeBlurredBg,
        );

        if (unchanged) {
            isFading = false;
            return;
        }

        stagingBg = nextBg;
        stagingBlurredBg = nextBlurredBg;
        isFading = true;

        const timer = setTimeout(() => {
            activeBg = nextBg;
            activeBlurredBg = nextBlurredBg;
            isFading = false;
        }, 500);

        return () => clearTimeout(timer);
    });

    let isFocused = $derived(appState.sentenceVisible || uiState.optionsOpen);
</script>

<div class="background-container" class:focused={isFocused}>
    <div
        class="bg-layer sharp"
        style="background-image: {activeBg}; background-color: {backgroundColor};"
    ></div>

    <div
        class="bg-layer blurred"
        style="background-image: {activeBlurredBg}; background-color: {backgroundColor};"
    ></div>

    {#if isFading}
        <div
            class="bg-layer sharp staging"
            style="background-image: {stagingBg}; background-color: {backgroundColor};"
        ></div>
        <div
            class="bg-layer blurred staging"
            style="background-image: {stagingBlurredBg}; background-color: {backgroundColor};"
        ></div>
    {/if}
</div>

<style>
    .background-container {
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100dvh;
        z-index: -1;
        overflow: hidden;
        pointer-events: none;
    }

    .bg-layer {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        will-change: opacity, transform;
    }

    .sharp {
        transform: scale(1);
        transition: transform 0.3s ease-out;
    }

    .blurred {
        transform: scale(1);
        opacity: 0;
        transition:
            transform 0.3s ease-out,
            opacity 0.3s ease-out;
    }

    /* Staging layers fade in smoothly over the active layers */
    .sharp.staging {
        opacity: 0;
        animation: fadeIn 0.5s ease-out forwards;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    /* Focus state animations */
    /* When focused, active blurred layer fades in */
    .background-container.focused > .blurred {
        transform: scale(1.03);
        opacity: 1;
    }

    /* When focused, staging blurred layer ALSO fades in if we are transitioning while focused */
    .background-container.focused > .blurred.staging {
        transform: scale(1.03);
        opacity: 1;
        animation: fadeInBlurred 0.5s ease-out forwards;
    }

    @keyframes fadeInBlurred {
        from {
            opacity: 0;
            transform: scale(1);
        }
        to {
            opacity: 1;
            transform: scale(1.03);
        }
    }

    .background-container.focused .sharp,
    .background-container.focused .sharp.staging {
        transform: scale(1);
    }
</style>
