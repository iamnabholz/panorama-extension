import type { StateSchema } from "./interfaces";

type Background = StateSchema["background"];

function isValidBackground(value: unknown): value is Background {
  if (
    typeof value !== "object" ||
    value === null ||
    !("type" in value) ||
    !("value" in value)
  ) {
    return false;
  }

  if (
    (value.type !== "image" &&
      value.type !== "color" &&
      value.type !== "none") ||
    typeof value.value !== "string"
  ) {
    return false;
  }

  if (value.type === "image") {
    // An empty URL is the application's valid initial image state.
    if (value.value === "") return true;

    try {
      return new URL(value.value).protocol === "https:";
    } catch {
      return false;
    }
  }

  if (value.type === "color") {
    // Color mode currently stores a CSS gradient, even for solid colors.
    return CSS.supports("background-image", value.value);
  }

  return true;
}

function discardStoredValue(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    // Recovery must not prevent startup when storage is unavailable.
    console.warn(`Could not remove invalid stored value "${key}".`, error);
  }
}

function readStoredValue(key: string): unknown {
  let raw: string | null;

  try {
    raw = localStorage.getItem(key);
  } catch (error) {
    console.warn(`Could not read stored value "${key}".`, error);
    return undefined;
  }

  if (raw === null) return undefined;

  if (raw === "undefined") {
    discardStoredValue(key);
    return undefined;
  }

  let value: unknown;

  try {
    value = JSON.parse(raw);
  } catch {
    console.warn(`Ignoring malformed JSON for stored value "${key}".`);
    discardStoredValue(key);
    return undefined;
  }

  if (key === "background" && !isValidBackground(value)) {
    console.warn("Ignoring invalid stored background.");
    discardStoredValue(key);
    return undefined;
  }

  return value;
}

export function loadBackground(): Background | undefined {
  const value = readStoredValue("background");
  return isValidBackground(value) ? value : undefined;
}

export async function loadData(keys: string[]) {
  const result: Record<string, unknown> = {};

  for (const key of keys) {
    const value = readStoredValue(key);

    if (value !== undefined) {
      result[key] = value;
    }
  }

  return result;
}

export function saveKey(key: string, value: unknown): void {
  if (value === undefined) {
    localStorage.removeItem(key);
    return;
  }

  localStorage.setItem(key, JSON.stringify(value));
}
