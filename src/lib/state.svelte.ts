// state.svelte.ts
import { loadData, saveData } from "./storage";

export const appState = $state({
  useMetric: false,
  use24Hour: false,
  sentenceVisible: true,

  backgroundType: "color",
  bgQuery: "Ocean green",
  bgColor: "#1e1e1e",
  // not persisted
  optionsOpen: false,
});

/** Fields NOT included when saving to storage. */
const transientKeys: (keyof typeof appState)[] = ["optionsOpen"];

function toPersisted(state: typeof appState) {
  const clone = { ...state };
  for (const key of transientKeys) delete clone[key];
  return clone;
}

export async function hydrateState(): Promise<void> {
  const savedState = await loadData("state");
  if (savedState) Object.assign(appState, savedState);

  const savedBackground = await loadData("background");
  if (savedBackground) {
    appState.backgroundType = savedBackground.type;
  }

  const savedColors = await loadData("color-cache");
  if (savedColors) {
    appState.bgColor = savedColors.startColor;
  }
}

/**
 * Single generic setter for any field in appState.
 * Automatically saves to storage unless the key is listed
 * in transientKeys above.
 */
export function setState<K extends keyof typeof appState>(
  key: K,
  value: (typeof appState)[K],
  ignore = false,
): void {
  appState[key] = value;
  if (!transientKeys.includes(key) && !ignore) {
    saveData("state", toPersisted(appState));
  }
}

export function setBackground(type: string, value: string): void {
  if (type == "color") {
    saveData("color-cache", { startColor: value });
    appState.bgColor = value;
  }

  appState.backgroundType = type;
  saveData("background", { type: type, value: value });
}
