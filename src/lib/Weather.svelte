<script lang="ts">
    import { appState } from "./state.svelte";
    import Widget from "./components/Widget.svelte";

    let description = $derived(
        appState["weather-cache"]?.description ?? "omnius",
    );
    let iconLink = $derived(
        `https://openweathermap.org/img/wn/${appState["weather-cache"]?.icon ?? "50d"}@2x.png`,
    );
    let location = $derived(appState["weather-cache"]?.location ?? "Unkown");
</script>

<Widget
    title={`Current weather information for ${location}`}
    text={description.charAt(0).toUpperCase() + description.slice(1)}
    iconSrc={iconLink}
    iconAlt={description}
/>
