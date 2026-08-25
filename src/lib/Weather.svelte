<script lang="ts">
    import { appState } from "./state.svelte";
    import Widget from "./components/Widget.svelte";

    let description = $derived(
        appState["weather-cache"]?.description ?? "omnius",
    );
    let iconLink = $derived(
        `https://openweathermap.org/img/wn/${appState["weather-cache"]?.icon ?? "50d"}@2x.png`,
    );
</script>

<span
    title={appState["weather-cache"]
        ? `Current weather information for ${appState["weather-cache"].location}.`
        : undefined}
>
    <Widget
        text={description.charAt(0).toUpperCase() + description.slice(1)}
        iconSrc={iconLink}
        iconAlt={description}
    />
</span>
