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
        if (nextHoliday) {
            dateExpanded = !dateExpanded;
        }
    }
</script>

<button
    type="button"
    onclick={toggleDateExpansion}
    title="See the next holiday in your country."
    aria-expanded={dateExpanded}
    aria-controls="holiday-details"
    disabled={nextHoliday == null}
    class="glassy stack"
    class:open={dateExpanded}
>
    <span class="basic-row">
        <span class="icon-badge" class:showing-today={isTodayHoliday}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
            >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path
                    d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12"
                />
                <path d="M16 3l0 4" />
                <path d="M8 3l0 4" />
                <path d="M4 11l16 0" />
                <path d="M8 15h2v2h-2l0 -2" />
            </svg>
        </span>

        <span class="date-label">
            {formatter.format(new Date())}
        </span>
    </span>

    {#if dateExpanded && nextHoliday}
        <span
            id="holiday-details"
            class="holiday-info"
            role="region"
            transition:slide|local={{ duration: 150 }}
        >
            <span class="holiday-content">
                <span class="holiday-tag">
                    {isTodayHoliday ? "TODAY" : "NEXT"}:
                </span>
                <span class="holiday-name">{nextHoliday.name}</span>
                {#if !isTodayHoliday}
                    <span class="holiday-date">
                        ({formatter.format(
                            new Date(nextHoliday.date as string),
                        )})
                    </span>
                {/if}
            </span>
        </span>
    {/if}
</button>

<style>
    .glassy {
        color: var(--color-text-summary);
    }

    button {
        cursor: pointer;
        padding: 4px 10px 4px 4px;
        border-radius: var(--radius-full);
        display: flex;
        flex-direction: column;
        align-items: center;
        font-weight: var(--font-weight-bold);
        font-size: var(--font-size-md);
        line-height: 1.4;
        color: inherit;
        background-color: transparent;
        transform-origin: center;
        height: 40px;
        transition: all var(--duration-fast) var(--ease-standard);
        overflow: hidden;
    }

    button:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.05);
    }

    button.open {
        background: light-dark(rgba(255, 255, 255, 0.25), rgba(0, 0, 0, 0.35));
        height: auto;
        padding: var(--space-03);
        border-radius: var(--radius-xl);
    }

    .basic-row {
        display: flex;
        align-items: center;
        gap: 2px;
        height: 32px;
    }

    .date-label {
        padding-inline-end: 4px;
        padding-block-start: 4px;
    }

    button svg {
        width: 18px;
        height: 18px;
        flex-shrink: 0;
    }

    .icon-badge {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 32px;
        width: 32px;
        border-radius: var(--radius-full);
        background-color: transparent;
        transition: background-color var(--duration-fast) var(--ease-out);
    }

    .icon-badge.showing-today {
        background-color: var(--color-accent);
    }

    button:disabled {
        cursor: default;
        opacity: 0.6;
    }

    .holiday-info {
        font-size: var(--font-size-sm);
        line-height: 1.3;
        text-align: center;
        padding: 2px 8px 4px 8px;
        overflow: hidden; /* Clips contents cleanly during vertical slide */
    }

    .holiday-content {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        white-space: nowrap; /* Prevents text from wrapping mid-transition */
    }

    .holiday-tag {
        font-size: 0.75em;
        font-weight: var(--font-weight-bold);
        color: var(--color-accent-hover, var(--accent-color));
    }

    .holiday-name {
        font-weight: var(--font-weight-bold);
    }

    .holiday-date {
        font-size: 0.85em;
        color: var(--color-text-secondary);
        font-weight: var(--font-weight-regular);
    }
</style>
