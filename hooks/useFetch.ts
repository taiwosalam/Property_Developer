import { useState, useEffect, useCallback } from "react";
import api from "@/services/api";
import axios, { AxiosRequestConfig } from "axios";

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  silentLoading: boolean;
  error: string | null;
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
        const { data } = await api<T>(url, config);
        // const { data } = await axios<T>(url, config);
        setData(data);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.data) {
          setError(err.response.data?.message);
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
    fetchData();
  }, [fetchData]); // Re-fetch when URL changes

  return {
    data,
    loading,
    silentLoading,
    error,
    refetch: (options) => fetchData(options),
  };
}

export default useFetch;
