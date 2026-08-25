export async function loadData(keys: string[]) {
  const result: Record<string, unknown> = {};
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
  if (value === undefined) {
    localStorage.removeItem(key);
    return;
  }
  localStorage.setItem(key, JSON.stringify(value));
}
