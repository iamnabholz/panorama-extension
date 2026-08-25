import type { BackgroundImage } from "./interfaces";
import { appState, persist } from "./state.svelte";

const WORKER_URL = "https://background-grab.nabholz.workers.dev/";
const CACHE_DURATION_MS = 160 * 60 * 1000; // adjust as needed

function toBackgroundImage(res: any, query: string): BackgroundImage {
  return {
    query: query,
    url: res.urls.full,
    author: res.user?.name ?? "",
    link: res.user?.links?.html ?? "",
    fetchedAt: Date.now(),
  };
}

function isStale(data: BackgroundImage | undefined): boolean {
  if (!data) return true;
  return Date.now() - data.fetchedAt > CACHE_DURATION_MS;
}

async function fetchFromApi(query: string): Promise<BackgroundImage> {
  const url = `${WORKER_URL}?cat=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Background fetch failed: ${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  return toBackgroundImage(json, query);
}

/**
 * Returns cached background if it's still fresh for the given query;
 * otherwise fetches from the worker, caches the result, and returns that instead.
 */
export async function fetchBackground(
  query: string,
): Promise<BackgroundImage | null> {
  try {
    const fresh = await fetchFromApi(query);

    appState["image-cache"] = fresh;
    persist();

    return fresh;
  } catch {
    return null;
  }
}

export async function checkBackgroundImage(): Promise<BackgroundImage | null> {
  const cached = appState["image-cache"];
  const cachedQuery = cached?.query ?? "Ocean horizon";

  if (cached && !isStale(cached)) {
    console.log("image from cache");
    return cached!;
  }

  return fetchBackground(cachedQuery);
}
