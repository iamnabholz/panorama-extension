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
        disabled = false,
    }: Props = $props();
    const isButton = $derived(!!onclick);
    const hasIcon = $derived(!!icon || !!iconSrc);

    function handleClick(event: MouseEvent) {
        if (disabled) return;
        onclick?.(event);
    }
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
    <button
        type="button"
        class="icon-text"
        onclick={handleClick}
        {title}
        aria-disabled={disabled}
        class:is-disabled={disabled}
    >
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
        transform-origin: center;
        cursor: default;
        margin: 0px 0px;
        transition:
            transform 0.4s cubic-bezier(0.34, 1.85, 0.64, 1),
            margin 0.4s cubic-bezier(0.34, 1.85, 0.64, 1),
            gap 0.4s cubic-bezier(0.34, 1.85, 0.64, 1);
    }

    .icon-text:focus-visible {
        outline: 4px solid currentColor;
        outline-offset: 6px;
    }

    button.icon-text {
        cursor: pointer;
    }

    button.icon-text.is-disabled {
        cursor: default;
    }

    .icon-text:hover {
        transform: scale(1.1);
        gap: 14px;
        margin: 0px 8px;
    }

    .icon-text:active {
        transform: scale(0.88);
        transition: transform 0.1s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .icon-slot {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: var(--sentence-icon-size);
        height: var(--sentence-icon-size);
        flex-shrink: 0;
        fill: currentColor;
        filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.2));
        transform-origin: center;
        transition:
            transform 0.45s cubic-bezier(0.34, 1.85, 0.64, 1),
            filter 0.3s ease-out;
    }

    .icon-text:hover .icon-slot {
        transform: scale(1.16) rotate(-10deg);
        filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.3));
    }

    .icon-text:active .icon-slot {
        transform: scale(0.85) rotate(6deg);
        transition: transform 0.1s ease-out;
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
        transition: transform 0.4s cubic-bezier(0.34, 1.85, 0.64, 1);
    }

    .icon-text:hover .label {
        transform: scale(1.04);
    }
</style>
