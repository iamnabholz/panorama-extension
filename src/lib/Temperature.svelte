<script lang="ts">
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

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleFormat();
        }
    }

    function celsiusToFahrenheit(celsius: number): number {
        return (celsius * 9) / 5 + 32;
    }
</script>

<button
    type="button"
    class="fragment"
    onclick={toggleFormat}
    onkeydown={handleKeydown}
    disabled={displayTemp == null}
    title={`Press to switch to ${appState.useMetric ? "Fahrenheit" : "Celsius"}.`}
    aria-label={`Current temperature ${displayTemp} degrees ${unit === "C" ? "Celsius" : "Fahrenheit"}. Press to switch to ${appState.useMetric ? "Fahrenheit" : "Celsius"}.`}
>
    {`${displayTemp ? displayTemp : "-"}°${unit}`}
</button>
