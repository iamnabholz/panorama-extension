<script lang="ts">
    import { appState, persist } from "./state.svelte";
    import ClockIcon from "./components/ClockIcon.svelte";
    import Widget from "./components/Widget.svelte";

    interface Props {
        currentTime: Date;
    }
    let { currentTime }: Props = $props();

    // Recompute the formatter only when the format actually changes
    let formatter = $derived(
        new Intl.DateTimeFormat(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: !appState.use24Hour,
        }),
    );

    let formattedTime = $derived(formatter.format(currentTime));

    function toggleFormat() {
        appState.use24Hour = !appState.use24Hour;
        persist();
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
    title={`Press to switch to ${appState.use24Hour ? "12" : "24"}-hour format.`}
    aria-label={`Current time ${formattedTime}. Press to switch to ${appState.use24Hour ? "12" : "24"}-hour format.`}
>
    <Widget text={formattedTime}>
        {#snippet icon()}
            <ClockIcon time={currentTime} />
        {/snippet}
    </Widget>
</button>
