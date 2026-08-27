import type { StateSchema } from "./interfaces";
import { loadData, saveKey } from "./storage/storage";

export const appState = $state<StateSchema>({
  useMetric: true,
  use24Hour: true,
  sentenceVisible: true,
  imageUpdateFrequency: "never",
  displayGreeting: true,
  displayTime: true,
  displayWeather: true,
  background: { type: "image", value: "" },
  "color-cache": { startColor: "#aaaaaa" },
});

export const uiState = $state({
  optionsOpen: false,
  sentenceVisible: appState.sentenceVisible,
  loadingData: [] as string[],
});

export function startLoading(): string {
  const id = crypto.randomUUID();
  uiState.loadingData = [...uiState.loadingData, id];
  return id;
}

export function stopLoading(id: string) {
  uiState.loadingData = uiState.loadingData.filter((item) => item !== id);
}

const keys: (keyof StateSchema)[] = [
  "useMetric",
  "use24Hour",
  "sentenceVisible",
  "imageUpdateFrequency",
  "displayGreeting",
  "displayTime",
  "displayWeather",
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
