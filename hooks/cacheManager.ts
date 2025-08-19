const createCache = () => {
  const data = new Map<string, any>();
  const ttls = new Map<string, number>();
  const maxSize = 100;
  const defaultTtl = 5 * 60 * 1000; // 5 minutes

  return {
    get(key: string) {
      if (!data.has(key)) return null;

      // Check if expired
      const expiry = ttls.get(key);
      if (expiry && Date.now() > expiry) {
        data.delete(key);
        ttls.delete(key);
        return null;
      }

      // Move to end (LRU)
      const value = data.get(key);
      data.delete(key);
      data.set(key, value);
      return value;
    },

    set(key: string, value: any, ttl?: number) {
      const timeToLive = ttl || defaultTtl;
      const expiry = Date.now() + timeToLive;

      // Remove if exists
      if (data.has(key)) {
        data.delete(key);
        ttls.delete(key);
      }
      // Remove oldest if at capacity
      else if (data.size >= maxSize) {
        const oldestKey = data.keys().next().value as string | undefined;
        if (oldestKey !== undefined) {
          data.delete(oldestKey);
          ttls.delete(oldestKey);
        }
      }

      data.set(key, value);
      ttls.set(key, expiry);
    },

    delete(key: string) {
      const deleted = data.delete(key);
      ttls.delete(key);
      return deleted;
    },

    clear() {
      data.clear();
      ttls.clear();
    },

    has(key: string) {
      if (!data.has(key)) return false;

      const expiry = ttls.get(key);
      if (expiry && Date.now() > expiry) {
        data.delete(key);
        ttls.delete(key);
        return false;
      }
      return true;
    },

    size() {
      return data.size;
    },

    keys() {
      return Array.from(data.keys());
    },
  };
};

// Singleton cache instance
const globalCache = createCache();

export const cacheManager = {
  // Core operations
  get: (key: string) => globalCache.get(key),
  set: (key: string, value: any, ttl?: number) =>
    globalCache.set(key, value, ttl),
  delete: (key: string) => globalCache.delete(key),
  clear: () => globalCache.clear(),
  has: (key: string) => globalCache.has(key),
  size: () => globalCache.size(),
  keys: () => globalCache.keys(),

  // Utility functions for pattern matching
  deleteByPattern: (pattern: RegExp) => {
    const keys = globalCache.keys();
    let deletedCount = 0;
    keys.forEach((key) => {
      if (pattern.test(key)) {
        globalCache.delete(key);
        deletedCount++;
      }
    });
    return deletedCount;
  },

  deleteCacheByUrl: (url: string) => {
    const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`^${escapedUrl}`);
    return cacheManager.deleteByPattern(pattern);
  },

  deleteCacheByPrefix: (prefix: string) => {
    const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`^${escapedPrefix}`);
    return cacheManager.deleteByPattern(pattern);
  },

  getKeysByPattern: (pattern: RegExp) => {
    return globalCache.keys().filter((key) => pattern.test(key));
  },
};

// Legacy support
export const getCache = () => {
  console.warn("getCache() is deprecated. Use cacheManager instead.");
  return {
    get: cacheManager.get,
    set: cacheManager.set,
    delete: cacheManager.delete,
  };
};
