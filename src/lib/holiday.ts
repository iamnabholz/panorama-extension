import type { HolidayCache, HolidayData } from "./interfaces";
import { appState, persist, startLoading, stopLoading } from "./state.svelte";

const HOLIDAYS_URL = "https://holiday-grab.nabholz.workers.dev/";
const CACHE_DURATION_MS = 4 * 30 * 24 * 60 * 60 * 1000;

async function fetchFromApi(): Promise<HolidayData[]> {
  const res = await fetch(HOLIDAYS_URL);

  if (!res.ok) {
    throw new Error(`Holiday fetch failed: ${res.status}`);
  }

  return res.json();
}

function isStale(cache: HolidayCache): boolean {
  const now = Date.now();
  const age = now - cache.fetchedAt;
  if (age >= CACHE_DURATION_MS) return true;

  // Force a refetch if we've crossed into a new year since the cache was fetched
  const fetchedYear = new Date(cache.fetchedAt).getFullYear();
  const currentYear = new Date(now).getFullYear();
  return currentYear > fetchedYear;
}

/**
 * Returns cached holidays if still fresh; otherwise fetches fresh data
 * from the worker, caches it, and returns that. Cache is considered stale
 * after ~4 months, OR immediately once the calendar year rolls over —
 * so Jan 1 always triggers a refetch regardless of cache age.
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
