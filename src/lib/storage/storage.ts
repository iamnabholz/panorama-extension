// storage.ts
const isExtension = import.meta.env.MODE === "extension";

export async function loadData(keys: string[]) {
  const result: Record<string, unknown> = {};

  if (isExtension) {
    const { default: browser } = await import("webextension-polyfill");

    const stored = await browser.storage.local.get(keys);
    for (const key of keys) {
      if (stored[key] !== undefined) result[key] = stored[key];
    }
    return result;
  }

  for (const key of keys) {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === "undefined") continue;
    try {
      result[key] = JSON.parse(raw);
    } catch {
      localStorage.removeItem(key); // corrupted entry, drop it
    }
  }
  return result;
}

export async function saveKey(key: string, value: unknown) {
  if (isExtension) {
    const { default: browser } = await import("webextension-polyfill");

    if (value === undefined) {
      await browser.storage.local.remove(key);
      return;
    }
    await browser.storage.local.set({ [key]: value });
    return;
  }

  if (value === undefined) {
    localStorage.removeItem(key);
    return;
  }
  localStorage.setItem(key, JSON.stringify(value));
}
