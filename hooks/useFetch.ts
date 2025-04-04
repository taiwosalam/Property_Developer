"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import api from "@/services/api";
import axios, { AxiosRequestConfig } from "axios";

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  silentLoading: boolean;
  error: string | null;
  isNetworkError: boolean;
  refetch: (options?: { silent?: boolean }) => Promise<void>;
}

function useFetch<T>(
  url: string | null, // Explicitly allow null
  config?: AxiosRequestConfig
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false); // Start with false
  const [silentLoading, setSilentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNetworkError, setIsNetworkError] = useState(false);
  const isInitialLoad = useRef(true);

  const fetchData = useCallback(
    async (options: { silent?: boolean } = {}) => {
      const { silent = false } = options;

      // Skip fetching if URL is null or falsy
      if (!url) {
        setData(null);
        setError(null);
        setIsNetworkError(false);
        setLoading(false);
        setSilentLoading(false);
        return;
      }

      try {
        // Set loading state based on whether it's silent
        if (silent) {
          setSilentLoading(true);
        } else {
          setLoading(true);
        }
        setError(null);
        setIsNetworkError(false);

        // Perform the fetch
        const { data } = await api.get<T>(url, config);
        setData(data);
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
      } finally {
        // Reset loading states
        if (silent) {
          setSilentLoading(false);
        } else {
          setLoading(false);
        }
      }
    },
    [url, config]
  );

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
    refetch: (options) => fetchData(options),
  };
}

export default useFetch;