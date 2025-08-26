
"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import api from "@/services/api";
import axios, { AxiosRequestConfig } from "axios";

// Cache interface
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheConfig {
  enabled?: boolean;
  key?: string;
  ttl?: number; // Time to live in milliseconds
  staleWhileRevalidate?: boolean; // Return stale data while fetching fresh data
}

interface UseFetchConfig extends AxiosRequestConfig {
  cache?: CacheConfig;
}

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  silentLoading: boolean;
  error: string | null;
  isNetworkError: boolean;
  refetch: (options?: { silent?: boolean }) => Promise<void>;
  fromCache?: boolean;
  clearCache?: () => void;
}

// In-memory cache store
const cache = new Map<string, CacheEntry<any>>();

// Helper functions
const generateCacheKey = (url: string, config?: AxiosRequestConfig): string => {
  const configStr = config ? JSON.stringify({
    params: config.params,
    headers: config.headers,
    method: config.method || 'GET'
  }) : '';
  return `${url}:${configStr}`;
};

const isCacheValid = <T>(entry: CacheEntry<T>): boolean => {
  return Date.now() - entry.timestamp < entry.ttl;
};

const getCachedData = <T>(key: string): T | null => {
  const entry = cache.get(key);
  if (entry && isCacheValid(entry)) {
    return entry.data;
  }
  // Remove expired entry
  if (entry) {
    cache.delete(key);
  }
  return null;
};

const setCachedData = <T>(key: string, data: T, ttl: number): void => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  });
};

const clearCacheEntry = (key: string): void => {
  cache.delete(key);
};

// Global cache management
export const clearAllCache = (): void => {
  cache.clear();
};

export const clearCacheByPattern = (pattern: string): void => {
  const regex = new RegExp(pattern);
  Array.from(cache.keys()).forEach(key => {
    if (regex.test(key)) {
      cache.delete(key);
    }
  });
};

function useFetch<T>(
  url: string | null,
  config?: UseFetchConfig
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [silentLoading, setSilentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNetworkError, setIsNetworkError] = useState(false);
  const [fromCache, setFromCache] = useState(false);
  const isInitialLoad = useRef(true);

  // Extract cache config
  const cacheConfig = config?.cache || {};
  const {
    enabled: cacheEnabled = false,
    key: customCacheKey,
    ttl = 5 * 60 * 1000, // Default 5 minutes
    staleWhileRevalidate = false
  } = cacheConfig;

  // Generate cache key
  const cacheKey = customCacheKey || (url ? generateCacheKey(url, config) : null);

  const fetchData = useCallback(
    async (options: { silent?: boolean; bypassCache?: boolean } = {}) => {
      const { silent = false, bypassCache = false } = options;

      // Skip fetching if URL is null or falsy
      if (!url) {
        setData(null);
        setError(null);
        setIsNetworkError(false);
        setLoading(false);
        setSilentLoading(false);
        setFromCache(false);
        return;
      }

      // Check cache first if enabled and not bypassing
      if (cacheEnabled && cacheKey && !bypassCache) {
        const cachedData = getCachedData<T>(cacheKey);
        if (cachedData) {
          setData(cachedData);
          setError(null);
          setIsNetworkError(false);
          setFromCache(true);

          // If not using stale-while-revalidate, return early
          if (!staleWhileRevalidate) {
            setLoading(false);
            setSilentLoading(false);
            return;
          }
          // For stale-while-revalidate, continue fetching but don't show loading
        }
      }

      try {
        // Set loading state based on whether it's silent and if we have cached data
        const hasValidCache = cacheEnabled && cacheKey && getCachedData<T>(cacheKey);
        const shouldShowLoading = !silent && !hasValidCache;
        
        if (shouldShowLoading) {
          setLoading(true);
        } else if (silent) {
          setSilentLoading(true);
        }

        setError(null);
        setIsNetworkError(false);

        // Perform the fetch
        // Destructure to remove 'cache' before passing to axios
        const { cache: _cache, ...axiosConfig } = config || {};
        const { data: responseData } = await api.get<T>(url, axiosConfig);
        
        setData(responseData);
        setFromCache(false);

        // Cache the response if caching is enabled
        if (cacheEnabled && cacheKey) {
          setCachedData(cacheKey, responseData, ttl);
        }
      } catch (err) {
        // Handle errors
        if (axios.isAxiosError(err)) {
          if (!err.response) {
            setIsNetworkError(true);
            setError(err.message || "Network Error");
          } else {
            const errorData = err.response.data;
            const errorMessage =
              errorData?.message ||
              (typeof errorData?.error === "string"
                ? errorData?.error
                : typeof errorData?.error?.message === "string"
                ? errorData.error.message
                : "Something went wrong");
            setError(errorMessage);
          }
        } else {
          setError((err as Error)?.message);
        }
        setFromCache(false);
      } finally {
        // Reset loading states
        setLoading(false);
        setSilentLoading(false);
      }
    },
    [url, config, cacheEnabled, cacheKey, ttl, staleWhileRevalidate]
  );

  const clearCache = useCallback(() => {
    if (cacheKey) {
      clearCacheEntry(cacheKey);
    }
  }, [cacheKey]);

  const refetch = useCallback((options: { silent?: boolean } = {}) => {
    return fetchData({ ...options, bypassCache: true });
  }, [fetchData]);

  useEffect(() => {
    // Only fetch if URL is truthy
    if (url) {
      fetchData({ silent: !isInitialLoad.current });
    } else {
      // Reset states when URL is null
      setData(null);
      setError(null);
      setIsNetworkError(false);
      setLoading(false);
      setSilentLoading(false);
      setFromCache(false);
    }
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
    }
  }, [fetchData, url]);

  return {
    data,
    loading,
    silentLoading,
    error,
    isNetworkError,
    refetch,
    fromCache,
    clearCache
  };
}

export default useFetch;