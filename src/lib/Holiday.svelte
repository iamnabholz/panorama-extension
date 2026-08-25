<script lang="ts">
    import type { HolidayData } from "./holiday";
    import { appState } from "./state.svelte";

    let nextHoliday = $derived.by((): HolidayData | null => {
        const todayIso = toLocalISODate(new Date());
        return (
            appState["holiday-cache"]?.holidays
                .filter((h) => h.date >= todayIso)
                .sort((a, b) => a.date.localeCompare(b.date))[0] ?? null
        );
    });

    // Formats a Date as "YYYY-MM-DD" using LOCAL time
    function toLocalISODate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    let formatter = new Intl.DateTimeFormat(undefined, {
        weekday: "long",
        day: "numeric",
        month: "short",
    });

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
    onclick={toggleTodayDate}
    onkeydown={handleKeydown}
    title="See the next holiday in your country."
    aria-label="See the next holiday in your country."
    disabled={nextHoliday == null}
>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            d="M19 22H5v-2h14v2ZM5 8h14V6h2v14h-2V10H5v10H3V6h2v2Zm4 10H7v-2h2v2Zm4 0h-2v-2h2v2Zm-4-4H7v-2h2v2Zm4 0h-2v-2h2v2Zm4 0h-2v-2h2v2ZM9 4h6V2h2v2h2v2H5V4h2V2h2v2Z"
        />
    </svg>
    {#if showTodayDate}
        {formatter.format(new Date())}
    {:else}
        {nextHoliday?.name}
    {/if}
</button>

<style>
    button {
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

    button svg {
        width: 22px;
        height: 22px;
        flex-shrink: 0;
        position: relative;
        top: 5px;

        filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.2));
    }

    button:disabled {
        cursor: default;
    }
</style>
