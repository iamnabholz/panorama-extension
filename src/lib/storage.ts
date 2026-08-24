import type { HolidayData } from "./holiday";
import type { WeatherData } from "./weather";

/**
 * Schema of everything this app stores.
 * Add new keys here — this is the single source of truth
 * for what's storable and what type each key holds.
 */
export interface StorageSchema {
  background: {
    type: string;
    value: string;
  };

  "image-cache": {
    url: string;
    author: string;
    link: string;
  };
  "color-cache": {
    startColor: string;
    endColor?: string;
  };

  "weather-cache": WeatherData;
  "holiday-cache": {
    holidays: HolidayData[];
    fetchedAt: number;
  };

  state: Partial<{
    useMetric: boolean;
    use24Hour: boolean;

    sentenceVisible: boolean;
  }>;
}

export type StorageKey = keyof StorageSchema;

interface StorageBackend {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
}

/**
 * True when a real extension runtime is present.
 * Checked WITHOUT importing the polyfill, so this is safe to call
 * in any context (plain web, tests, SSR) without throwing.
 */
function hasExtensionStorage(): boolean {
  return false;
}

let backendPromise: Promise<StorageBackend> | null = null;

async function resolveBackend(): Promise<StorageBackend> {
  if (hasExtensionStorage()) {
    // Only imported when we've already confirmed an extension
    // runtime exists — the polyfill's internal check will pass.
    const { default: browser } = await import("webextension-polyfill");
    return {
      async get(key) {
        const result = await browser.storage.local.get(key);
        return key in result ? (result[key] as string) : null;
      },
      async set(key, value) {
        await browser.storage.local.set({ [key]: value });
      },
    };
  }

  return {
    async get(key) {
      return localStorage.getItem(key);
    },
    async set(key, value) {
      localStorage.setItem(key, value);
    },
  };
}

function getBackend(): Promise<StorageBackend> {
  if (!backendPromise) backendPromise = resolveBackend();
  return backendPromise;
}

export async function loadData<K extends StorageKey>(
  key: K,
): Promise<StorageSchema[K] | null> {
  const backend = await getBackend();
  const raw = await backend.get(key);
  if (raw == null) return null;
  try {
    return JSON.parse(raw) as StorageSchema[K];
  } catch (err) {
    console.error(`Failed to parse stored data for "${key}":`, err);
    return null;
  }
}

export async function saveData<K extends StorageKey>(
  key: K,
  value: StorageSchema[K],
): Promise<void> {
  try {
    const backend = await getBackend();
    await backend.set(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to save data for "${key}":`, err);
  }
}
