import type { WeatherData, WeatherResponse } from "./interfaces";
import { appState, persist, startLoading, stopLoading } from "./state.svelte";

const OPEN_WEATHER_URL = "https://weather-grab.nabholz.workers.dev/";
const CACHE_DURATION_MS = 120 * 60 * 1000; // adjust as needed

function isStale(cache: WeatherData): boolean {
  if (!cache) return true;
  return Date.now() - cache.fetchedAt > cache.cacheDuration;
}

function toWeatherData(res: WeatherResponse): WeatherData {
  return {
    temperature: res.main.temp,
    description: res.weather[0]?.description,
    icon: res.weather[0]?.icon,
    location: res.name,
    fetchedAt: Date.now(),
    cacheDuration: CACHE_DURATION_MS,
  };
}

async function fetchFromApi(): Promise<WeatherData> {
  const url = new URL(OPEN_WEATHER_URL);
  const res = await fetch(url.toString());

  if (!res.ok) {
    throw new Error(`Weather fetch failed: ${res.status} ${res.statusText}`);
  }

  const json: WeatherResponse = await res.json();
  return toWeatherData(json);
}

/**
 * Returns cached weather if it's still fresh; otherwise fetches
 * from the worker, caches the result, and returns that instead.
 * Returns null if the fetch fails and there's no usable cache.
 */
export async function fetchWeather(): Promise<WeatherData | null> {
  const cached = appState["weather-cache"];
  if (cached && !isStale(cached)) {
    console.log("weather from cache");
    return cached;
  }

  const loadId = startLoading();
  try {
    const fresh = await fetchFromApi();
    appState["weather-cache"] = fresh;
    persist();

    return fresh;
  } catch (err) {
    console.error("Weather fetch failed:", err);

    return cached ?? null; // fall back to stale cache if we have one, else null
  } finally {
    stopLoading(loadId);
  }
}
