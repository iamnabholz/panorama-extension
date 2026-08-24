<script lang="ts">
    interface Props {
        text: string;
        icon?: import("svelte").Snippet;
        iconSrc?: string;
        iconAlt?: string;
    }

    let { text, icon, iconSrc, iconAlt = "" }: Props = $props();
</script>

<span class="icon-text">
    <span class="icon-slot" style="animation-delay: {Math.random() * -2}s">
        {#if icon}
            {@render icon()}
        {:else if iconSrc}
            <img src={iconSrc} alt={iconAlt} />
        {/if}
    </span>
    <span class="label">{text}</span>
</span>

<style>
    .icon-text {
        display: inline-flex;
        align-items: center;
        gap: 0.3em;
        vertical-align: middle;
        margin-left: 0.1em;
    }

    .icon-slot {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: var(--sentence-icon-size);
        height: var(--sentence-icon-size);
        vertical-align: middle;
        flex-shrink: 0;
        fill: currentColor;
        scale: 1;
        transform: translateY(-4px) translateX(6px);

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
        line-height: inherit;
    }
</style>
