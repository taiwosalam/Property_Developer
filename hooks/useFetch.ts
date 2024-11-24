import { useState, useEffect, useCallback } from "react";
import api from "@/services/api";
import axios, { AxiosRequestConfig } from "axios";

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: (options?: { silent?: boolean }) => Promise<void>;
}

function useFetch<T>(
  url: string,
  config?: AxiosRequestConfig
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (options: { silent?: boolean } = {}) => {
      const { silent = false } = options;
      try {
        if (!silent) {
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
        if (!silent) {
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
    error,
    refetch: (options) => fetchData(options),
  };
}

export default useFetch;
