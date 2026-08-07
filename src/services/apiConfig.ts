/**
 * Centralized API Configuration & Network Utility
 * Handles environment variables, memory caching, exponential backoff retries,
 * rate limit protection, and error handling for all external oceanographic APIs.
 */

export const API_KEYS = {
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || '',
  GOOGLE_API_KEY: import.meta.env.VITE_GOOGLE_API_KEY || '',
  NOAA_API_KEY: import.meta.env.VITE_NOAA_API_KEY || '',
  NASA_API_KEY: import.meta.env.VITE_NASA_API_KEY || '',
  ARGO_API_KEY: import.meta.env.VITE_ARGO_API_KEY || '',
  OPEN_METEO_API_KEY: import.meta.env.VITE_OPEN_METEO_API_KEY || '',
};

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class ApiCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL: number = 10 * 60 * 1000; // 10 minutes cache

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > this.defaultTTL) {
      this.cache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlMs?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

export const apiCache = new ApiCache();

/**
 * Robust Fetch wrapper with retry mechanism, exponential backoff, rate limiting & cache support
 */
export async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  retries: number = 2,
  backoffMs: number = 500,
  cacheTTLMs: number = 10 * 60 * 1000
): Promise<T> {
  const cacheKey = `${options.method || 'GET'}:${url}:${JSON.stringify(options.body || '')}`;
  const cachedData = apiCache.get<T>(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  let attempt = 0;
  while (attempt <= retries) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 429) {
          // Rate limited - wait longer before retry
          await new Promise((resolve) => setTimeout(resolve, backoffMs * 3));
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = (await response.json()) as T;
      apiCache.set<T>(cacheKey, data, cacheTTLMs);
      return data;
    } catch (err: any) {
      attempt++;
      if (attempt > retries) {
        console.warn(`[ApiConfig] Fetch failed after ${retries} retries for URL: ${url}`, err);
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, backoffMs * Math.pow(2, attempt - 1)));
    }
  }

  throw new Error(`Failed to fetch from ${url}`);
}
