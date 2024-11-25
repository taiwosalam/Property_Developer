import { useState, useEffect, useCallback, useRef, useMemo } from "react";
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
  url: string,
  config?: AxiosRequestConfig
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [silentLoading, setSilentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNetworkError, setIsNetworkError] = useState(false);
  const isInitialLoad = useRef(true);

  const fetchData = useCallback(
    async (options: { silent?: boolean } = {}) => {
      const { silent = false } = options;
      try {
        if (silent) {
          setSilentLoading(true);
        } else {
          setLoading(true);
        }
        setError(null);
        setIsNetworkError(false);
        const { data } = await api.get<T>(url, config);
        setData(data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (!err.response) {
            // This indicates a network error or cors error (no response received)
            setIsNetworkError(true);
            setError(err.message || "Network Error");
          } else {
            setError(
              err.response.data?.message ||
                err.response?.data?.error ||
                "Something went wrong"
            );
          }
        } else {
          setError((err as Error)?.message);
        }
      } finally {
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
    fetchData({ silent: !isInitialLoad.current });
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
    }
  }, [fetchData]);

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
