import type { BackgroundImage, WeatherData, HolidayData } from "./interfaces";
import { loadData, saveKey } from "./storage/storage";

/**
 * Schema of everything this app stores.
 * Add new keys here — this is the single source of truth
 * for what's storable and what type each key holds.
 */
export interface StateSchema {
  useMetric: boolean;
  use24Hour: boolean;
  sentenceVisible: boolean;

  background: {
    type: string;
    value: string;
  };
  "color-cache": {
    startColor: string;
    endColor?: string;
  };

  "image-cache"?: BackgroundImage;
  "weather-cache"?: WeatherData;
  "holiday-cache"?: {
    holidays: HolidayData[];
    fetchedAt: number;
  };
}

export const appState = $state<StateSchema>({
  useMetric: true,
  use24Hour: true,
  sentenceVisible: true,
  background: { type: "image", value: "" },
  "color-cache": { startColor: "#aaaaaa" },
});

export const uiState = $state({
  optionsOpen: false,
  sentenceVisible: appState.sentenceVisible,
});

const keys: (keyof StateSchema)[] = [
  "useMetric",
  "use24Hour",
  "sentenceVisible",
  "background",
  "color-cache",
  "image-cache",
  "weather-cache",
  "holiday-cache",
];

/**
 * Load storage values into the current app state
 */
export async function hydrateState() {
  const stored = await loadData(keys);
  Object.assign(appState, stored);

  uiState.sentenceVisible = appState.sentenceVisible;
  return stored;
}

export async function persist() {
  const snapshot = $state.snapshot(appState);
  for (const key of keys) {
    await saveKey(key, snapshot[key]);
  }
}
