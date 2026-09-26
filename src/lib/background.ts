import type { BackgroundImage } from "./utils/interfaces";
import {
  appState,
  persist,
  startLoading,
  stopLoading,
  uiState,
} from "./state.svelte";

const WORKER_URL = "https://background-grab.nabholz.workers.dev/";
const DEFAULT_QUERIES = [
  "Ocean view",
  "Forest",
  "Architecture",
  "Sunset",
  "Horizon",
  "Beach",
  "Night street",
  "Street photography",
  "Neon signs",
  "Gradients",
  "Abstract",
];

const TIMER_HOURLY = 60 * 60 * 1000;
const TIMER_DAILY = 24 * 60 * 60 * 1000;

function isStale(data: BackgroundImage): boolean {
  if (!data) return true;

  let cacheTime: number;
  if (appState.imageUpdateFrequency == "hourly") {
    cacheTime = TIMER_HOURLY;
  } else if (appState.imageUpdateFrequency == "daily") {
    cacheTime = TIMER_DAILY;
  } else {
    return false;
  }

  return Date.now() - data.fetchedAt > cacheTime;
}

function toBackgroundImage(res: any, query: string): BackgroundImage {
  return {
    query,
    url: res.urls.raw + "&w=1500&dpr=2",
    author: res.user.name,
    color: res.color,
    link: res.user.links.html,
    fetchedAt: Date.now(),
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
  if (uiState.loadingBackground) return null;
  uiState.loadingBackground = true;

  const loadId = startLoading();

  try {
    const fresh = await fetchFromApi(query);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = fresh.url;
    await img.decode();

    const canvas = document.createElement("canvas");
    const scale = Math.min(1, 1280 / img.naturalWidth);
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);

    const ctx = canvas.getContext("2d")!;
    if (!ctx) throw new Error("Canvas 2D context unavailable");

    ctx.filter = "blur(8px)";
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    fresh.blurredUrl = canvas.toDataURL("image/webp", 0.8);

    appState["image-cache"] = fresh;
    persist("image-cache");

    if (appState.background.type === "image") {
      document.documentElement.style.setProperty(
        "--background-value",
        `url("${fresh.url}")`,
      );

      appState.background.value = fresh.url;
      persist("background");
    }

    return fresh;
  } catch (err) {
    console.error("Background fetch failed:", err);

    return null;
  } finally {
    uiState.loadingBackground = false;
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

  const query =
    cached?.query ??
    DEFAULT_QUERIES[Math.floor(Math.random() * DEFAULT_QUERIES.length)];
  return (await fetchBackground(query)) ?? cached ?? null;
}
