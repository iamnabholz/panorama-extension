<script lang="ts">
    import { celsiusToFahrenheit } from "./weather";
    import { appState, setState } from "./state.svelte";

    interface Props {
        currentTemp: number | null;
    }
    let { currentTemp }: Props = $props();

    let displayTemp = $derived.by(() => {
        if (currentTemp == null) return 20; // fallback default
        return appState.useMetric
            ? Math.floor(currentTemp)
            : Math.floor(celsiusToFahrenheit(currentTemp));
    });

    let unit = $derived(appState.useMetric ? "C" : "F");

    function toggleFormat() {
        setState("useMetric", !appState.useMetric);
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleFormat();
        }
    }
</script>

<button
    type="button"
    class="fragment"
    onclick={toggleFormat}
    onkeydown={handleKeydown}
    title={`Press to switch to ${appState.useMetric ? "Fahrenheit" : "Celsius"}.`}
    aria-label={`Current temperature ${displayTemp} degrees ${unit === "C" ? "Celsius" : "Fahrenheit"}. Press to switch to ${appState.useMetric ? "Fahrenheit" : "Celsius"}.`}
>
    {`${displayTemp}°${unit}`}
</button>
