<script lang="ts">
    import { slide } from "svelte/transition";
    import type { HolidayData } from "./interfaces";
    import { appState } from "./state.svelte";

    // "YYYY-MM-DD" in local time (Intl avoids manual padStart plumbing)
    const isoFormatter = new Intl.DateTimeFormat("en-CA"); // en-CA = YYYY-MM-DD
    function toLocalISODate(date: Date): string {
        return isoFormatter.format(date);
    }

    const todayIso = $derived(toLocalISODate(new Date()));

    const sortedUpcoming = $derived.by((): HolidayData[] => {
        return (appState["holiday-cache"]?.holidays ?? [])
            .filter((h) => h.date >= todayIso)
            .sort((a, b) => a.date.localeCompare(b.date));
    });

    let nextHoliday = $derived(sortedUpcoming[0] ?? null);
    let isTodayHoliday = $derived(nextHoliday?.date === todayIso);

    let formatter = new Intl.DateTimeFormat(undefined, {
        weekday: "long",
        day: "numeric",
        month: "short",
    });

    let dateExpanded = $state(false);

    function toggleDateExpansion() {
        dateExpanded = !dateExpanded;
    }
</script>

<button
    type="button"
    onclick={toggleDateExpansion}
    title="See the next holiday in your country."
    disabled={nextHoliday == null}
    class="glass stack"
    class:open={dateExpanded}
>
    <span class="basic-row">
        <span class="icon-badge" class:showing-today={isTodayHoliday}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    d="M19 22H5v-2h14v2ZM5 8h14V6h2v14h-2V10H5v10H3V6h2v2Zm4 10H7v-2h2v2Zm4 0h-2v-2h2v2Zm-4-4H7v-2h2v2Zm4 0h-2v-2h2v2Zm4 0h-2v-2h2v2ZM9 4h6V2h2v2h2v2H5V4h2V2h2v2Z"
                />
            </svg>
        </span>

        <span style="padding-top: 1px;">
            {formatter.format(new Date())}
        </span>
    </span>

    {#if dateExpanded && nextHoliday}
        <span class="holiday-info" transition:slide|local>
            <span
                style="font-size: 0.8em; font-weight: normal; color: var(--accent-color);"
            >
                {isTodayHoliday ? "TODAY" : "NEXT"}
            </span>
            <br />
            {nextHoliday.name}
            <br />
            {#if !isTodayHoliday}
                <span style="font-size: 0.8em;  font-weight: normal;">
                    {formatter.format(new Date(nextHoliday.date as string))}
                </span>
            {/if}
        </span>
    {/if}
</button>

<style>
    .holiday-info {
        line-height: 1.2;
        text-align: center;
    }

    .basic-row {
        display: flex;
        align-items: center;
        gap: 4px;

        padding-right: 6px;
    }

    button {
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 100px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        font-weight: bold;
        font-size: 1rem;
        line-height: 1.8;
        color: inherit;

        height: 32px;

        transition: 150ms ease;
    }

    button svg {
        width: 22px;
        height: 22px;
        flex-shrink: 0;
        margin-bottom: 1px;
        filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.3));
        transform: translateX(-0.1px);
    }

    .icon-badge {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 32px;
        width: 32px;
        border-radius: 100px;
        background-color: transparent;
        transition: background-color 150ms ease-out;
    }

    .icon-badge.showing-today {
        background-color: var(--accent-color);
    }

    button:disabled {
        cursor: default;
    }

    button:focus-within {
        outline: 2px solid currentColor;
        outline-offset: 2px;
    }

    button.open {
        background: var(--color-black);
        height: 106px;
        border-radius: 24px;
        padding: 12px;
    }
</style>
