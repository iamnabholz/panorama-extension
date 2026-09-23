<script lang="ts">
    import type { Snippet } from "svelte";
    import { sound } from "../utils/sound";

    interface Props {
        text: string;
        icon?: Snippet;

        onclick?: (event: MouseEvent) => void;
        title?: string;
        disabled?: boolean;
        zoomIcon?: boolean;
        textOnly?: boolean;
        color?: string;
    }

    let {
        text,
        icon,

        onclick,
        title,
        disabled = false,
        zoomIcon = false,
        textOnly = false,
        color,
    }: Props = $props();

    const hasIcon = $derived(!textOnly && !!icon);
    const words = $derived(text.trim().split(/\s+/).filter(Boolean));
</script>

{#snippet iconSlot()}
    <span class="icon-slot" class:zoom-icon={zoomIcon}>
        <span class="icon-art">
            {@render icon?.()}
        </span>
    </span>
{/snippet}

{#snippet content(label: string, showIcon: boolean)}
    <span class="visual">
        {#if showIcon}
            {@render iconSlot()}
        {/if}
        <span class="label">{label}</span>
    </span>
{/snippet}

{#if onclick}
    <button
        data-sentence-piece
        type="button"
        class="widget"
        onclick={(event) => {
            sound.playClick();
            onclick?.(event);
        }}
        class:text-only={textOnly}
        style:color
        {title}
        {disabled}
    >
        {@render content(text, hasIcon)}
    </button>
{:else}
    {#each words as word, index (`${index}:${word}`)}
        {#if index > 0}{" "}{/if}
        <span
            data-sentence-piece
            class="widget"
            class:text-only={textOnly}
            style:color
            {title}
        >
            {@render content(word, hasIcon && index === 0)}
        </span>
    {/each}
{/if}

<style>
    .widget {
        --growth: 1.2;

        display: inline-block;
        position: relative;
        vertical-align: baseline;

        margin: 0;
        padding: 0;
        border: 0;
        background: none;

        font: inherit;
        line-height: inherit;
        letter-spacing: inherit;
        text-align: inherit;
        text-shadow: inherit;
        color: var(--color-text-summary);
        font-weight: var(--font-weight-bold);

        white-space: nowrap;
        cursor: inherit;
        overflow: visible;
    }

    .visual {
        display: inline-block;
        position: relative;
        vertical-align: baseline;
        transform-origin: center;

        transition: transform 400ms cubic-bezier(0.34, 1.85, 0.64, 1);
    }

    button.widget {
        cursor: pointer;
        box-shadow: none;
    }

    button.widget:not(:disabled):not(.text-only):is(:hover, :focus-visible) {
        padding-inline: 0.05em;

        &:has(.icon-slot) {
            padding-inline: 0.38em;
        }
    }

    button.widget:not(:disabled):not(.text-only):is(:hover, :focus-visible)
        .icon-slot {
        padding-inline: 0.6em;
    }

    button.widget:not(:disabled):not(.text-only):is(:hover, :focus-visible)
        .visual {
        transform: scale(var(--growth));
    }

    button.widget:not(:disabled):not(.text-only):active .visual {
        transform: scale(0.985);
        transition-duration: 90ms;
    }

    button.widget:disabled {
        cursor: default;
    }

    button.widget:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: 0.09em;
        border-radius: 0.12em;
    }

    .text-only {
        color: inherit;
        font-weight: inherit;
    }

    .icon-slot {
        display: inline-block;
        position: relative;

        width: 1em;
        height: 0;
        vertical-align: baseline;
    }

    .icon-art {
        position: absolute;
        inset-inline-start: 0;
        bottom: -0.18em;

        width: 1.1em;
        height: 1.1em;

        fill: currentColor;
        pointer-events: none;
        filter: drop-shadow(0 0.035em 0.07em rgb(0 0 0 / 0.16));

        transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1);
    }

    .icon-art :global(svg) {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    button.widget:not(:disabled):is(:hover, :focus-visible)
        .zoom-icon
        .icon-art {
        transform: rotate(-7deg) scale(1.4);
    }
</style>
