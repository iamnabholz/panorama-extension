<script lang="ts">
    import type { WeatherData } from "./weather";
    import Widget from "./components/Widget.svelte";

    interface Props {
        weatherData: WeatherData | null;
    }
    let { weatherData }: Props = $props();

    let description = $derived(weatherData?.description ?? "Cloudy");
    let iconLink = $derived(
        `https://openweathermap.org/img/wn/${weatherData?.icon ?? "02d"}@2x.png`,
    );
</script>

<span
    title={weatherData
        ? `Current weather information for ${weatherData.location}.`
        : undefined}
>
    <Widget
        text={description.charAt(0).toUpperCase() + description.slice(1)}
        iconSrc={iconLink}
        iconAlt={description}
    />
</span>
