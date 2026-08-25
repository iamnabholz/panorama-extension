import type { HolidayCache, HolidayData } from "./interfaces";
import { appState, persist } from "./state.svelte";

const HOLIDAYS_URL = "https://holiday-grab.nabholz.workers.dev/";
const CACHE_DURATION_MS = 14 * 24 * 60 * 60 * 1000; // 2 weeks

function isStale(cache: HolidayCache | undefined): boolean {
  if (!cache) return true;
  return Date.now() - cache.fetchedAt > CACHE_DURATION_MS;
}

async function fetchFromApi(): Promise<HolidayData[]> {
  const response = await fetch(HOLIDAYS_URL);
  if (!response.ok) {
    throw new Error(`Holiday fetch failed: ${response.status}`);
  }
  return response.json();
}

/**
 * Returns cached holidays if the cache is under 2 weeks old;
 * otherwise fetches fresh data from the worker, caches it, and returns that.
 */
export async function fetchHolidays(): Promise<HolidayData[]> {
  const cached = appState["holiday-cache"];
  if (cached && !isStale(cached)) {
    console.log("holidays from cache");
    return cached.holidays;
  }

  const fresh = await fetchFromApi();

  appState["holiday-cache"] = {
    holidays: fresh,
    fetchedAt: Date.now(),
  };
  persist();

  return fresh;
}
