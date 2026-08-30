<script lang="ts">
    interface Props {
        text: string;
        icon?: import("svelte").Snippet;
        iconSrc?: string;
        iconAlt?: string;
        onclick?: (event: MouseEvent) => void;
        title?: string;
        disabled?: boolean;
    }
    let {
        text,
        icon,
        iconSrc,
        iconAlt = "",
        onclick,
        title,
        disabled,
    }: Props = $props();
    const isButton = $derived(!!onclick);
    const hasIcon = $derived(!!icon || !!iconSrc);
</script>

{#snippet iconSlot()}
    <span class="icon-slot">
        {#if icon}
            {@render icon()}
        {:else if iconSrc}
            <img src={iconSrc} alt={iconAlt} />
        {/if}
    </span>
{/snippet}

{#if isButton}
    <button type="button" class="icon-text" {onclick} {title} {disabled}>
        {#if hasIcon}
            {@render iconSlot()}
        {/if}
        <span class="label">{text}</span>
    </button>
{:else}
    <span class="icon-text">
        {#if hasIcon}
            {@render iconSlot()}
        {/if}
        <span class="label">{text}</span>
    </span>
{/if}

<style>
    .icon-text {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        border-radius: 8px;
    }

    .icon-text:focus-visible {
        outline: 4px solid currentColor;
        outline-offset: 6px;
    }
    button.icon-text {
        transition: transform 0.15s ease-out;
    }
    button.icon-text:hover {
        transform: scale(1.05);
    }
    button.icon-text:active {
        transform: scale(0.95); /* quick "press" feedback on click */
        transition: transform 0.05s ease-out;
    }
    button.icon-text:disabled {
        transform: scale(1);
        cursor: unset;
    }
    .icon-slot {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: var(--sentence-icon-size);
        height: var(--sentence-icon-size);
        flex-shrink: 0;
        fill: currentColor;
        scale: 1;
        filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.2));
    }
    .icon-slot :global(svg),
    .icon-slot img {
        width: 100%;
        height: 100%;
        display: block;
    }

    .icon-slot img {
        scale: 1.8;
    }
    .label {
        line-height: 1;
        text-box-trim: trim-both;
        text-box-edge: cap alphabetic;
    }
</style>
