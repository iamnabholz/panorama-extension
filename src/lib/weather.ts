import { loadData, saveData } from "./storage";

export interface WeatherResponse {
  coord: { lon: number; lat: number };
  weather: { id: number; main: string; description: string; icon: string }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: { speed: number; deg: number };
  clouds: { all: number };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface WeatherData {
  temperature: number; // Celsius, raw from API
  description: string;
  icon: string;
  location: string;
  fetchedAt: number;
}

const OPEN_WEATHER_URL = "https://weather-grab.nabholz.workers.dev/";
const CACHE_DURATION_MS = 80 * 60 * 1000; // adjust as needed

function toWeatherData(res: WeatherResponse): WeatherData {
  return {
    temperature: res.main.temp,
    description: res.weather[0]?.description ?? "Cloud",
    icon: res.weather[0]?.icon ?? "02d",
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
  const cached = await loadData("weather-cache");

  if (!isStale(cached)) {
    return cached!;
  }

  const fresh = await fetchFromApi();
  await saveData("weather-cache", fresh);
  return fresh;
}

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}
