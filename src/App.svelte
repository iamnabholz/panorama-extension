<script lang="ts">
    import { SvelteDate } from "svelte/reactivity";
    import { fade, fly } from "svelte/transition";

    import { appState, hydrateState } from "./lib/state.svelte";

    import Holiday from "./lib/Holiday.svelte";
    import Clock from "./lib/Clock.svelte";
    import Greeting from "./lib/Greeting.svelte";
    import Weather from "./lib/Weather.svelte";
    import Temperature from "./lib/Temperature.svelte";

    import Options from "./lib/Options.svelte";
    import ActionBar from "./lib/ActionBar.svelte";

    import { fetchWeather, type WeatherData } from "./lib/weather";
    let weatherData = $state<WeatherData | null>(null);

    $effect(() => {
        fetchWeather().then((data) => {
            weatherData = data;
        });
    });

    const currentTime = new SvelteDate();

    $effect(() => {
        const interval = setInterval(() => {
            currentTime.setTime(Date.now());
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    });

    let mounted = $state(false);
    let hydrated = $state(false);

    $effect(() => {
        requestAnimationFrame(() => {
            mounted = true;
        });
    });

    $effect(() => {
        hydrateState().then(() => {
            hydrated = true;
        });
    });
</script>

<div id="viewport">
    <span class:fade={!appState.sentenceVisible || !mounted}>
        <Holiday date={currentTime} />
    </span>
    <span
        class:fade-slide={!appState.sentenceVisible || !mounted}
        style="transition-delay: {!appState.sentenceVisible ? '60ms' : '0ms'}"
    >
        <Greeting {currentTime} />
    </span>
    <div
        class="sentence-row"
        class:fade-slide={!appState.sentenceVisible || !mounted}
        style="transition-delay: {!appState.sentenceVisible ? '0ms' : '60ms'}"
    >
        <p class="faint">It's</p>
        <Clock {currentTime} />
        <p class="faint">— currently</p>
        <Temperature currentTemp={weatherData?.temperature || null} />
        <p class="faint">and</p>
        <Weather {weatherData} />
    </div>

    <br /> <br /> <br />
</div>

{#if appState.optionsOpen}
    <div class="options-overlay" transition:fly={{ y: "80" }}>
        <Options />
    </div>
{/if}

<span transition:fade>
    <ActionBar />
</span>

<style>
    #viewport {
        height: 100%;
        overflow: hidden;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: var(--paragraph-gap);

        margin: 0 auto;
        width: min(640px, 100%);

        cursor: default;
        user-select: none;
        -webkit-user-select: none;

        font-size: var(--sentence-font-size);
        font-weight: bold;
        text-shadow: var(--sentence-shadow);

        color: white;

        transition:
            opacity 0.3s ease,
            transform 0.3s ease;
    }

    .options-overlay {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 8%;
    }

    .sentence-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: var(--sentence-gap);
    }

    #viewport * {
        transition:
            opacity 0.3s ease,
            transform 0.3s ease;
    }

    :global(.fade-slide) {
        opacity: 0;
        transform: translateY(110px);
        pointer-events: none;
    }

    :global(.fade) {
        opacity: 0;
    }

    :global(.faint) {
        opacity: 0.6;
        font-weight: normal;
    }
</style>
