<script lang="ts">
    import { appState, persist } from "./state.svelte";

    import ClockIcon from "./components/ClockIcon.svelte";
    import Widget from "./components/Widget.svelte";
    import { SvelteDate } from "svelte/reactivity";

    const currentTime = new SvelteDate();

    $effect(() => {
        const interval = setInterval(() => {
            currentTime.setTime(Date.now());
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    });

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
</script>

<Widget
    title={`Press to switch to ${appState.use24Hour ? "12" : "24"}-hour format.`}
    text={formattedTime.toUpperCase()}
    onclick={toggleFormat}
>
    {#snippet icon()}
        <ClockIcon {currentTime} />
    {/snippet}
</Widget>
