<script lang="ts">
    import { onMount } from "svelte";
    import { slide } from "svelte/transition";
    import type { HolidayData } from "./utils/interfaces";
    import { appState } from "./state.svelte";

    function toLocalISODate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    function fromLocalISODate(value: string): Date {
        const [year, month, day] = value.split("-").map(Number);
        return new Date(year, month - 1, day);
    }

    let todayIso = $state(toLocalISODate(new Date()));

    onMount(() => {
        let timer: ReturnType<typeof setTimeout>;

        function refreshDate() {
            clearTimeout(timer);

            const now = new Date();
            todayIso = toLocalISODate(now);

            const nextMidnight = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 1,
            );

            timer = setTimeout(
                refreshDate,
                nextMidnight.getTime() - now.getTime() + 100,
            );
        }

        function handleVisibility() {
            if (document.visibilityState === "visible") {
                refreshDate();
            }
        }

        refreshDate();

        // Catch up after the browser suspends a background tab.
        document.addEventListener("visibilitychange", handleVisibility);
        window.addEventListener("focus", refreshDate);

        return () => {
            clearTimeout(timer);
            document.removeEventListener("visibilitychange", handleVisibility);
            window.removeEventListener("focus", refreshDate);
        };
    });

    const sortedUpcoming = $derived.by((): HolidayData[] => {
        return (appState["holiday-cache"]?.holidays ?? [])
            .filter((h) => h.date >= todayIso)
            .sort((a, b) => a.date.localeCompare(b.date));
    });

    let nextHoliday = $derived(sortedUpcoming[0] ?? null);
    let isTodayHoliday = $derived(nextHoliday?.date === todayIso);

    let formatterDay = new Intl.DateTimeFormat(undefined, {
        weekday: "long",
    });

    let formatterDate = new Intl.DateTimeFormat(undefined, {
        day: "numeric",
    });

    let formatterMonth = new Intl.DateTimeFormat(undefined, {
        month: "short",
    });

    let formatter = new Intl.DateTimeFormat(undefined, {
        day: "numeric",
        month: "short",
        weekday: "long",
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
    class="surface stack"
    class:open={dateExpanded}
>
    <span class="basic-row">
        <span class="date-label">
            {formatterDay.format(fromLocalISODate(todayIso))},
            {formatterDate.format(fromLocalISODate(todayIso))}
        </span>

        <span class="month-label" class:showing-today={isTodayHoliday}>
            {formatterMonth.format(fromLocalISODate(todayIso))}
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
                    {isTodayHoliday ? "TODAY" : "NEXT"}
                </span>
                <span class="holiday-name">{nextHoliday.name}</span>
                {#if !isTodayHoliday}
                    <span class="holiday-date">
                        {formatter.format(fromLocalISODate(nextHoliday.date))}
                    </span>
                {/if}
            </span>
        </span>
    {/if}
</button>

<style>
    button {
        cursor: pointer;
        border-radius: var(--radius-full);
        display: flex;
        flex-direction: column;
        gap: var(--space-04);
        padding: var(--space-03) var(--space-05);
        padding-top: calc(var(--space-03) + 2px);

        overflow: hidden;
        text-shadow: none;

        font-weight: var(--font-weight-bold);
        font-size: var(--font-size-md);
        line-height: 1.4;

        color: var(--color-text);
        transform-origin: center;
        transition: all var(--duration-fast) var(--ease-standard);
    }

    button.open {
        border-radius: var(--radius-lg);
        padding-block: var(--space-05);
        background-color: var(--color-background-panel);
    }

    .basic-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-09);
    }

    .month-label {
        color: var(--color-text-summary-muted);
        font-size: var(--font-size-xs);
        text-transform: uppercase;
    }

    .month-label.showing-today {
        color: var(--color-red);
    }

    button:disabled {
        cursor: default;
    }

    .holiday-info {
        font-size: var(--font-size-sm);
        line-height: 1;
        overflow: hidden; /* Clips contents cleanly during vertical slide */
        width: 100%;
    }

    .holiday-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        gap: var(--space-02);
        white-space: nowrap; /* Prevents text from wrapping mid-transition */
        padding-top: var(--space-02);
    }

    .holiday-tag {
        font-size: var(--font-size-xs);
        font-weight: var(--font-weight-bold);
        color: var(--color-red);
    }

    .holiday-name {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-bold);
    }

    .holiday-date {
        font-size: var(--font-size-xs);
        font-weight: var(--font-weight-regular);
    }
</style>
