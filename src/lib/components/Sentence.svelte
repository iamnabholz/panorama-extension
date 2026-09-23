<script lang="ts">
    import { appState } from "../state.svelte";
    import Clock from "../Clock.svelte";
    import Temperature from "../Temperature.svelte";
    import Weather from "../Weather.svelte";
    import Widget from "./Widget.svelte";
    import { sentenceLayout } from "../utils/sentence";
</script>

<div class="sentence" use:sentenceLayout>
    {#if appState.displayTime}
        <Widget text="It's " textOnly />
        <Clock />
    {/if}

    {#if appState.displayTime && appState.displayWeather}
        <Widget text=" — " textOnly />
    {/if}

    {#if appState.displayWeather}
        <Widget
            text={appState.displayTime ? "currently " : "Currently "}
            textOnly
        />
        <Temperature />
        <Widget text=" and " textOnly />
        <Weather />
    {/if}
</div>

<style>
    .sentence {
        position: relative;
        display: block;

        width: 100%;
        max-width: 26ch;
        padding-inline: 2ch;
        margin-inline: auto;

        text-align: center;
        line-height: 1.4;
        font-weight: var(--font-weight-regular);

        /*
         * Ordinary wrapping avoids rebalancing the entire sentence
         * whenever a hovered control gains a little width.
         */
        text-wrap: wrap;
        overflow: visible;
    }
</style>
