<script lang="ts">
    import { getTodaysHoliday } from "./holiday";
    import type { HolidayData } from "./holiday";

    let holiday = $state<HolidayData | null>(null);

    $effect(() => {
        getTodaysHoliday().then((result) => {
            holiday = result;
        });
    });

    import { getNextHoliday } from "./holiday";

    let next = $state<Awaited<ReturnType<typeof getNextHoliday>> | null>(null);

    $effect(() => {
        getNextHoliday().then((result) => {
            next = result;
        });
    });

    // Recompute the formatter only when the format actually changes
    let formatter = $derived(
        new Intl.DateTimeFormat(undefined, {
            weekday: "long",
            day: "numeric",
            month: "short",
        }),
    );

    interface Props {
        date: Date;
    }
    let { date }: Props = $props();

    let showTodayDate = $state(true);

    function toggleTodayDate() {
        showTodayDate = !showTodayDate;
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleTodayDate();
        }
    }
</script>

<button
    type="button"
    class="pill"
    onclick={toggleTodayDate}
    onkeydown={handleKeydown}
    title={holiday ? "See today's holiday" : "Nothing today"}
    aria-label={holiday ? "See today's holiday" : "Nothing today"}
    disabled={holiday == null}
>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={holiday ? "var(--accent-color)" : "currentColor"}
        viewBox="0 0 24 24"
        style="filter: drop-shadow(var(--sentence-shadow));"
    >
        <path
            d="M19 22H5v-2h14v2ZM5 8h14V6h2v14h-2V10H5v10H3V6h2v2Zm4 10H7v-2h2v2Zm4 0h-2v-2h2v2Zm-4-4H7v-2h2v2Zm4 0h-2v-2h2v2Zm4 0h-2v-2h2v2ZM9 4h6V2h2v2h2v2H5V4h2V2h2v2Z"
        />
    </svg>
    {#if showTodayDate}
        {formatter.format(date)}
    {:else}
        {holiday}
    {/if}
</button>

<style>
    .pill {
        cursor: pointer;
        padding: 4px 18px 4px 16px;
        border-radius: 200px;
        display: flex;
        align-items: baseline;
        gap: 10px;
        font-weight: bold;
        font-size: 1rem;
        line-height: 1.8;
        color: inherit;

        background: rgba(255, 255, 255, 0.15);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(2px);
        -webkit-backdrop-filter: blur(2px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .pill svg {
        width: 22px;
        height: 22px;
        flex-shrink: 0;
        position: relative;
        top: 5px;
    }

    .pill:disabled {
        cursor: default;
    }
</style>
