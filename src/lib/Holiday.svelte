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
    class="surface stack"
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
            {formatter.format(fromLocalISODate(todayIso))}
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
        padding: 0.4em;
        padding-inline-end: 0.7em;
        cursor: pointer;
        border-radius: var(--radius-full);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-04);

        overflow: hidden;
        text-shadow: none;

        font-weight: var(--font-weight-bold);
        font-size: var(--font-size-md);
        line-height: 1.4;

        color: var(--color-text-summary);
        transform-origin: center;
        transition: all var(--duration-fast) var(--ease-standard);
    }

    button.open {
        border-radius: var(--radius-xl);
        padding: var(--space-04);
        padding-right: calc(var(--space-04) + 5px);
        background-color: var(--color-background-panel);
    }

    .basic-row {
        display: flex;
        align-items: center;
        gap: var(--space-01);
    }

    .date-label {
        padding-inline-end: 4px;
        padding-block-start: 4px;
    }

    button svg {
        width: 1.2em;
        height: 1.2em;
        flex-shrink: 0;
    }

    .icon-badge {
        padding: 6px;
        height: 32px;
        width: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--radius-full);
        background-color: transparent;
        transition: background-color var(--duration-fast) var(--ease-out);
    }

    .icon-badge.showing-today {
        margin-inline-end: 0.3em;
        background-color: var(--color-red);
    }

    button:disabled {
        cursor: default;
    }

    .holiday-info {
        font-size: var(--font-size-sm);
        line-height: 1;
        text-align: center;
        overflow: hidden; /* Clips contents cleanly during vertical slide */
    }

    .holiday-content {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
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
