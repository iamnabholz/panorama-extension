<script lang="ts">
    import Widget from "./components/Widget.svelte";
    import { appState, persist } from "./state.svelte";

    let displayTemp = $derived.by(() => {
        const temp = appState["weather-cache"]?.temperature ?? null;

        if (temp == null) return null; // fallback default
        return appState.useMetric
            ? Math.floor(temp)
            : Math.floor(celsiusToFahrenheit(temp));
    });

    let unit = $derived(appState.useMetric ? "C" : "F");

    function toggleFormat() {
        appState.useMetric = !appState.useMetric;
        persist();
    }

    function celsiusToFahrenheit(celsius: number): number {
        return (celsius * 9) / 5 + 32;
    }
</script>

<Widget
    title={`Press to switch to ${appState.useMetric ? "Fahrenheit" : "Celsius"}.`}
    text={`${displayTemp ? displayTemp : "-"}°${unit}`}
    onclick={toggleFormat}
    disabled={displayTemp == null}
/>
