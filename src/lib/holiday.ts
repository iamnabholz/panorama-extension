import { loadData, saveData } from "./storage";

export interface HolidayData {
  country: string;
  iso: string;
  year: number;
  date: string; // "YYYY-MM-DD"
  day: string; // "Monday", "Tuesday", etc.
  name: string;
}

interface HolidayCache {
  holidays: HolidayData[];
  fetchedAt: number;
}

const HOLIDAYS_URL = "https://holiday-grab.nabholz.workers.dev/";
const CACHE_DURATION_MS = 14 * 24 * 60 * 60 * 1000; // 2 weeks

function isStale(cache: HolidayCache | null): boolean {
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
  const cached = await loadData("holiday-cache");

  if (!isStale(cached)) {
    return cached!.holidays;
  }

  const fresh = await fetchFromApi();
  await saveData("holiday-cache", {
    holidays: fresh,
    fetchedAt: Date.now(),
  });
  return fresh;
}

/**
 * Returns today's holiday, if any, using cache-or-fetch logic.
 */
export async function getTodaysHoliday(): Promise<HolidayData | null> {
  const holidays = await fetchHolidays();
  const isoDate = toLocalISODate(new Date());
  return holidays.find((h) => h.date === isoDate) ?? null;
}

export async function getNextHoliday(): Promise<HolidayData | null> {
  const holidays = await fetchHolidays();
  const todayIso = toLocalISODate(new Date());

  const upcoming = holidays
    .filter((h) => h.date > todayIso)
    .sort((a, b) => a.date.localeCompare(b.date));

  return upcoming[0] ?? null;
}

// Formats a Date as "YYYY-MM-DD" using LOCAL time, not UTC —
// date.toISOString() would shift the date across timezone boundaries.
function toLocalISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
