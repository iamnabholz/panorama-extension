<script>
    import Background from "./lib/Background.svelte";
    import Reddit from "./lib/Reddit.svelte";
    import Weather from "./lib/Weather.svelte";
    import Shorcuts from "./lib/Shorcuts.svelte";
    import { settings } from "./stores";
    import { fade, slide } from "svelte/transition";
    import Date from "./lib/Date.svelte";
</script>

<main>
    <div class="side-bar">
        {#if $settings.date}
            <span transition:slide>
                <Date />
            </span>
        {/if}
        {#if $settings.weather}
            <span transition:slide>
                <Weather />
            </span>
        {/if}
        {#if $settings.topSites}
            <span transition:fade>
                <Shorcuts />
            </span>
        {/if}
    </div>

    {#if $settings.reddit}
        <Reddit />
    {/if}
</main>

<Background />

<style>
    main {
        padding: 6rem 2rem;
        height: 100vh;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 4rem;
    }

    .side-bar {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        gap: 2rem;
    }

    @media screen and (max-width: 680px) {
        main {
            flex-direction: column;
        }
    }
</style>
