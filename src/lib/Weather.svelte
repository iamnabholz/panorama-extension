<script lang="ts">
    import { appState } from "./state.svelte";
    import Widget from "./components/Widget.svelte";

    const weatherIcons = import.meta.glob<string>(
        "../assets/weather_icons/*.svg",
        {
            query: "?raw",
            import: "default",
            eager: true,
        },
    );

    const iconNames: Record<string, string> = {
        "01d": "clear-day",
        "01n": "clear-night",
        "02d": "partly-cloudy-day",
        "02n": "partly-cloudy-night",
        "03d": "cloudy",
        "03n": "cloudy",
        "04d": "overcast",
        "04n": "overcast",
        "09d": "cloudy-drizzle-day",
        "09n": "cloudy-drizzle-night",
        "10d": "rain",
        "10n": "rain",
        "11d": "thunderstorms",
        "11n": "thunderstorms",
        "13d": "snow",
        "13n": "snow",
        "50d": "fog-day",
        "50n": "fog-night",
    };

    let weatherData = $derived(appState["weather-cache"]);
    let description = $derived(weatherData?.description ?? "Unkown");
    let location = $derived(weatherData?.location ?? "Unknown");

    let iconSvg = $derived.by(() => {
        const iconName = iconNames[weatherData?.icon ?? ""];

        return (
            weatherIcons[`../assets/weather_icons/${iconName}.svg`] ??
            weatherIcons["../assets/weather_icons/clear-day.svg"] ??
            ""
        );
    });
</script>

<Widget
    title={`Current weather information for ${location}`}
    text={description.charAt(0).toUpperCase() + description.slice(1)}
>
    {#snippet icon()}
        <span aria-hidden="true">
            {@html iconSvg}
        </span>
    {/snippet}
</Widget>
