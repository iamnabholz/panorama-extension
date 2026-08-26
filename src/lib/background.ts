import { isStale } from "./cache";
import type { BackgroundImage } from "./interfaces";
import {
  appState,
  persist,
  startLoading,
  stopLoading,
  uiState,
} from "./state.svelte";

const WORKER_URL = "https://background-grab.nabholz.workers.dev/";
const CACHE_DURATION_MS = 1 * 24 * 60 * 60 * 1000; // adjust as needed
const DEFAULT_QUERY = "Ocean view";

function toBackgroundImage(res: any, query: string): BackgroundImage {
  return {
    query,
    url: res.urls.full,
    author: res.user?.name ?? "",
    link: res.user?.links?.html ?? "",
    fetchedAt: Date.now(),
    cacheDuration: CACHE_DURATION_MS,
  };
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
 * Fetches a fresh background for the given query, caches it, and returns it.
 * Returns null if the fetch fails.
 */
export async function fetchBackground(
  query: string,
): Promise<BackgroundImage | null> {
  const loadId = startLoading();

  try {
    const fresh = await fetchFromApi(query);
    appState["image-cache"] = fresh;
    persist();

    return fresh;
  } catch (err) {
    console.error("Background fetch failed:", err);

    return null;
  } finally {
    stopLoading(loadId);
  }
}

/**
 * Returns cached background if it's still fresh; otherwise fetches
 * a fresh one (using the cached query, or a default if there's no cache),
 * falling back to stale cache if the fetch fails.
 */
export async function checkBackgroundCache(): Promise<BackgroundImage | null> {
  const cached = appState["image-cache"];
  if (cached && !isStale(cached)) {
    console.log("image from cache");
    return cached;
  }
  const query = cached?.query ?? DEFAULT_QUERY;
  return (await fetchBackground(query)) ?? cached ?? null;
}
