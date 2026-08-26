import { isStale } from "./cache";
import type { HolidayCache, HolidayData } from "./interfaces";
import { appState, persist, startLoading, stopLoading } from "./state.svelte";

const HOLIDAYS_URL = "https://holiday-grab.nabholz.workers.dev/";
const CACHE_DURATION_MS = 6 * 4 * 7 * 24 * 60 * 60 * 1000; // 2 weeks

async function fetchFromApi(): Promise<HolidayData[]> {
  const res = await fetch(HOLIDAYS_URL);

  if (!res.ok) {
    throw new Error(`Holiday fetch failed: ${res.status}`);
  }

  return res.json();
}

/**
 * Returns cached holidays if the cache is under 2 weeks old;
 * otherwise fetches fresh data from the worker, caches it, and returns that.
 */
export async function fetchHolidays(): Promise<HolidayCache | null> {
  const cached = appState["holiday-cache"];
  if (cached && !isStale(cached)) {
    console.log("holidays from cache");
    return cached;
  }

  const loadId = startLoading();
  try {
    const fresh = await fetchFromApi();
    const newCache = {
      holidays: fresh,
      fetchedAt: Date.now(),
      cacheDuration: CACHE_DURATION_MS,
    };

    appState["holiday-cache"] = newCache;
    persist();

    return newCache;
  } catch (err) {
    console.error("Holidays fetch failed:", err);

    return cached ?? null; // fall back to stale cache if we have one, else null
  } finally {
    stopLoading(loadId);
  }
}
