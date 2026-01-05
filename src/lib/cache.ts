/**
 * Simple in-memory cache for API responses
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class Cache {
  private static store = new Map<string, CacheEntry<any>>();

  /**
   * Set cache entry
   */
  static set<T>(key: string, data: T, ttl: number = 3600000): void {
    this.store.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Get cache entry
   */
  static get<T>(key: string): T | null {
    const entry = this.store.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.store.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Check if key exists and is not expired
   */
  static has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Delete cache entry
   */
  static delete(key: string): void {
    this.store.delete(key);
  }

  /**
   * Clear all cache
   */
  static clear(): void {
    this.store.clear();
  }

  /**
   * Clear expired entries
   */
  static clearExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.store.delete(key);
      }
    }
  }
}

// Clear expired cache every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => Cache.clearExpired(), 300000);
}
