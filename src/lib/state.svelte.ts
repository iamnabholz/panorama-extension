import { untrack } from "svelte";
import type { StateSchema } from "./utils/interfaces";
import { loadData, saveKey } from "./utils/storage";

export const appState = $state<StateSchema>({
  useMetric: true,
  use24Hour: true,
  sentenceVisible: true,
  imageUpdateFrequency: "never",
  displayDate: true,
  displayGreeting: true,
  displayTime: true,
  displayWeather: true,
  playSounds: true,
  background: { type: "image", value: "" },
  "color-cache": { gradient: false, startColor: "#aaaaaa" },
});

export const uiState = $state({
  optionsOpen: false,
  sentenceVisible: appState.sentenceVisible,
  loadingData: [] as string[],
  showOnboardAtLaunch: false,
  isLoading: false,
  storageError: null as string | null,
});

export function startLoading(): string {
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  uiState.loadingData = [...uiState.loadingData, id];
  return id;
}

export function stopLoading(id: string) {
  uiState.loadingData = uiState.loadingData.filter((item) => item !== id);
}

const keys: (keyof StateSchema)[] = [
  "userName",
  "useMetric",
  "use24Hour",
  "sentenceVisible",
  "imageUpdateFrequency",
  "displayDate",
  "displayGreeting",
  "displayTime",
  "displayWeather",
  "playSounds",
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

const failedWrites = new Set<keyof StateSchema>();

export function persist(
  firstKey: keyof StateSchema,
  ...otherKeys: (keyof StateSchema)[]
): boolean {
  return untrack(() => {
    const changedKeys = new Set([firstKey, ...otherKeys]);
    let succeeded = true;

    for (const key of changedKeys) {
      try {
        const value = $state.snapshot(appState[key]);

        saveKey(key, value);
        failedWrites.delete(key);
      } catch (error) {
        succeeded = false;
        failedWrites.add(key);

        console.error(`Could not save "${key}".`, error);
      }
    }

    uiState.storageError =
      failedWrites.size > 0
        ? "Some changes could not be saved. They may be lost when this tab closes."
        : null;

    return succeeded;
  });
}

export function retryFailedWrites(): boolean {
  const [firstKey, ...otherKeys] = failedWrites;

  if (firstKey === undefined) return true;

  return persist(firstKey, ...otherKeys);
}
