interface Cacheable {
  fetchedAt: number;
  cacheDuration: number;
}

export function isStale(data: Cacheable | undefined | null): boolean {
  if (!data) return true;
  return Date.now() - data.fetchedAt > data.cacheDuration;
}
