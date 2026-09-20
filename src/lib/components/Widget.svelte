<script lang="ts">
    interface Props {
        text: string;
        icon?: import("svelte").Snippet;
        iconSrc?: string;
        iconAlt?: string;
        onclick?: (event: MouseEvent) => void;
        title?: string;
        disabled?: boolean;
        zoomIcon?: boolean;
    }
    let {
        text,
        icon,
        iconSrc,
        iconAlt = "",
        onclick,
        title,
        disabled = false,
        zoomIcon = false,
    }: Props = $props();
    const isButton = $derived(!!onclick);
    const hasIcon = $derived(!!icon || !!iconSrc);

    function handleClick(event: MouseEvent) {
        if (disabled) return;
        onclick?.(event);
    }
</script>

{#snippet iconSlot()}
    <span class="icon-slot" class:zoom-icon={zoomIcon}>
        {#if icon}
            {@render icon()}
        {:else if iconSrc}
            <img src={iconSrc} alt={iconAlt} />
        {/if}
    </span>
{/snippet}

{#if isButton}
    <button
        type="button"
        class="widget"
        onclick={handleClick}
        {title}
        aria-disabled={disabled}
        class:is-disabled={disabled}
    >
        <span class="visual">
            {#if hasIcon}
                {@render iconSlot()}
            {/if}
            <span class="label">{text}</span>
        </span>
    </button>
{:else}
    <span class="widget">
        <span class="visual">
            {#if hasIcon}
                {@render iconSlot()}
            {/if}
            <span class="label">{text}</span>
        </span>
    </span>
{/if}

<style>
    .widget {
        display: inline;
        vertical-align: baseline;
        background: none;
        margin: 0px;
        border: 0;
        font: inherit;
        color: inherit;
        white-space: nowrap;
        cursor: default;
    }
    button.widget {
        cursor: pointer;
    }
    button.widget.is-disabled {
        cursor: default;
    }

    .widget:focus-visible {
        outline: 4px solid currentColor;
        outline-offset: 2px;
        border-radius: 8px;
    }

    .visual {
        display: inline-flex;
        align-items: baseline; /* Key: aligns icon and text baselines together */
        gap: 0.1em;
        font-weight: var(--font-weight-bold);
        color: var(--color-text-summary);
        transform-origin: center;
        transition:
            transform 110ms cubic-bezier(0.34, 1.85, 0.64, 1),
            margin-inline-start 110ms cubic-bezier(0.34, 1.85, 0.64, 1);
        will-change: transform margin-inline-start;
    }

    .widget:hover .visual {
        transform: scale(1.01);
    }
    .widget:active .visual {
        transform: scale(0.99);
    }

    .icon-slot {
        display: inline-block;
        scale: 1.2;
        width: 0.9em;
        height: 0.9em;
        flex-shrink: 0;
        fill: currentColor;
        /* Optical baseline alignment for SVG/Images inside inline-flex baseline */
        position: relative;
        top: 0.1em;
        filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.2));
        transition:
            transform 0.45s cubic-bezier(0.34, 1.85, 0.64, 1),
            filter 0.3s ease-out;
    }
    .widget:hover .icon-slot.zoom-icon {
        transform: scale(1.6) rotate(-8deg);
        filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.3));
    }
    .widget:active .icon-slot.zoom-icon {
        transform: scale(0.9) rotate(4deg);
        transition-duration: 0.1s;
    }

    .icon-slot :global(svg),
    .icon-slot img {
        width: 100%;
        height: 100%;
        display: block;
    }
    .icon-slot img {
        transform: translateY(-2px);
        scale: 1.8;
    }

    .label {
        line-height: inherit;
    }
</style>
