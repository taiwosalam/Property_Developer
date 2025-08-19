"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import api from "@/services/api";
import axios, { AxiosRequestConfig } from "axios";
import { cacheManager } from "./cacheManager";

interface CacheOptions {
  enabled?: boolean;
  key?: string;
  ttl?: number;
}

interface UseFetchOptions extends AxiosRequestConfig {
  cache?: CacheOptions;
}

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  silentLoading: boolean;
  error: string | null;
  isNetworkError: boolean;
  fromCache?: boolean;
  refetch: (options?: {
    silent?: boolean;
    config?: AxiosRequestConfig;
    url?: string;
    skipCache?: boolean;
  }) => Promise<void>;
  clearCache?: () => void;
}

function useFetch<T>(
  url: string | null,
  config?: AxiosRequestConfig
): Omit<UseFetchResult<T>, "fromCache" | "clearCache">;

function useFetch<T>(
  url: string | null,
  options: UseFetchOptions & { cache: CacheOptions }
): UseFetchResult<T>;

function useFetch<T>(
  url: string | null,
  configOrOptions?: AxiosRequestConfig | UseFetchOptions
): UseFetchResult<T> {
  const isOptionsFormat = configOrOptions && "cache" in configOrOptions;
  const { cache: cacheOptions, ...config } = isOptionsFormat
    ? (configOrOptions as UseFetchOptions)
    : { cache: undefined, ...(configOrOptions as AxiosRequestConfig) };

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [silentLoading, setSilentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNetworkError, setIsNetworkError] = useState(false);
  const [fromCache, setFromCache] = useState(false);

  const isInitialLoad = useRef(true);
  const urlRef = useRef<string | null>(url);
  const configRef = useRef(config);
  const cacheOptionsRef = useRef(cacheOptions);

  const isCacheEnabled = cacheOptionsRef.current?.enabled === true;

  // Cache key generator
  const generateCacheKey = useCallback(
    (fetchUrl: string, fetchConfig?: AxiosRequestConfig): string => {
      if (cacheOptionsRef.current?.key) {
        return cacheOptionsRef.current.key;
      }

      const configForKey = fetchConfig
        ? {
            params: fetchConfig.params,
            headers: fetchConfig.headers,
            method: fetchConfig.method || "GET",
          }
        : {};

      return `${fetchUrl}:${JSON.stringify(configForKey)}`;
    },
    []
  );

  // Clear cache
  const clearCache = useCallback(() => {
    if (isCacheEnabled && urlRef.current) {
      const cacheKey = generateCacheKey(urlRef.current, configRef.current);
      cacheManager.delete(cacheKey);
    }
  }, [isCacheEnabled, generateCacheKey]);

  // Get cache
  const getFromCache = useCallback(
    (cacheKey: string): T | null => {
      if (!isCacheEnabled) return null;
      return cacheManager.get(cacheKey);
    },
    [isCacheEnabled]
  );

  // Set cache
  const setToCache = useCallback(
    (cacheKey: string, responseData: T) => {
      if (!isCacheEnabled) return;
      const ttl = cacheOptionsRef.current?.ttl;
      cacheManager.set(cacheKey, responseData, ttl);
    },
    [isCacheEnabled]
  );

  // Fetch data
  const fetchData = useCallback(
    async (
      fetchOptions: {
        silent?: boolean;
        config?: AxiosRequestConfig;
        url?: string;
        skipCache?: boolean;
      } = {}
    ) => {
      const { silent = false, config, url, skipCache = false } = fetchOptions;

      // Update refs if provided
      if (url !== undefined) urlRef.current = url;
      if (config !== undefined) configRef.current = config;

      // Handle null or falsy URL
      if (!urlRef.current) {
        setData(null);
        setError(null);
        setIsNetworkError(false);
        setFromCache(false);
        setLoading(false);
        setSilentLoading(false);
        return;
      }

      const cacheKey = generateCacheKey(urlRef.current, configRef.current);

      // Cache check
      if (!skipCache && isCacheEnabled) {
        const cachedData = getFromCache(cacheKey);
        if (cachedData !== null) {
          setData(cachedData);
          setFromCache(true);
          setError(null);
          setIsNetworkError(false);
          setLoading(false);
          setSilentLoading(false);
          return;
        }
      }

      try {
        if (silent) setSilentLoading(true);
        else setLoading(true);

        setError(null);
        setIsNetworkError(false);
        setFromCache(false);

        const response = await api.get<T>(urlRef.current, configRef.current);

        if (isCacheEnabled) {
          setToCache(cacheKey, response.data);
        }

        setData(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (!err.response) {
            setIsNetworkError(true);
            setError(err.message || "Network Error");
          } else {
            const errorData = err.response.data;
            const errorMessage =
              errorData?.message ||
              (typeof errorData?.error === "string"
                ? errorData.error
                : typeof errorData?.error?.message === "string"
                ? errorData.error.message
                : "Something went wrong");
            setError(errorMessage);
          }
        } else {
          setError((err as Error)?.message);
        }
      } finally {
        if (silent) setSilentLoading(false);
        else setLoading(false);
      }
    },
    [generateCacheKey, getFromCache, setToCache, isCacheEnabled]
  );

  // Initial fetch
  useEffect(() => {
    if (urlRef.current) {
      fetchData({ silent: !isInitialLoad.current });
    } else {
      setData(null);
      setError(null);
      setIsNetworkError(false);
      setFromCache(false);
      setLoading(false);
      setSilentLoading(false);
    }
    isInitialLoad.current = false;
  }, [fetchData]);

  // Refetch if url/config changes
  useEffect(() => {
    cacheOptionsRef.current = cacheOptions;

    if (url === null) {
      urlRef.current = null;
      setData(null);
      setError(null);
      setIsNetworkError(false);
      setFromCache(false);
      setLoading(false);
      setSilentLoading(false);
      return;
    }

    if (config !== undefined) {
      const oldConfigString = JSON.stringify(configRef.current || {});
      const newConfigString = JSON.stringify(config || {});
      const hasUrlChanged = urlRef.current !== url;
      const hasConfigChanged = oldConfigString !== newConfigString;

      if (hasUrlChanged || hasConfigChanged) {
        urlRef.current = url;
        configRef.current = config;
        fetchData({ silent: true });
      }
    }
  }, [url, config, cacheOptions, fetchData]);

  const baseResult = {
    data,
    loading,
    silentLoading,
    error,
    isNetworkError,
    refetch: fetchData,
  };

  return isCacheEnabled ? { ...baseResult, fromCache, clearCache } : baseResult;
}

export default useFetch;
