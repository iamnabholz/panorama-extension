import type { WeatherData, WeatherResponse } from "./interfaces";
import { appState, persist } from "./state.svelte";

const OPEN_WEATHER_URL = "https://weather-grab.nabholz.workers.dev/";
const CACHE_DURATION_MS = 80 * 60 * 1000; // adjust as needed

function toWeatherData(res: WeatherResponse): WeatherData {
  return {
    temperature: res.main.temp,
    description: res.weather[0]?.description,
    icon: res.weather[0]?.icon,
    location: res.name,
    fetchedAt: Date.now(),
  };
}

function isStale(data: WeatherData | null): boolean {
  if (!data) return true;
  return Date.now() - data.fetchedAt > CACHE_DURATION_MS;
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
 */
export async function fetchWeather(): Promise<WeatherData> {
  const cached = appState["weather-cache"];
  if (cached && !isStale(cached)) {
    console.log("weather from cache");
    return cached;
  }

  const fresh = await fetchFromApi();
  appState["weather-cache"] = fresh;
  persist();

  return fresh;
}
