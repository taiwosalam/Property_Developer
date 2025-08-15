import React, { createContext, useContext, useEffect, useState } from "react";
import api from "@/services/api";
import useFetch from "./useFetch";
import useRefetchOnEvent from "./useRefetchOnEvent";

interface SettingsContextType {
  data: any;
  isLoading: boolean;
  error: string | null;
  refetch?: () => void;
}

interface ApiDataType {
  data: any;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<any>(null);
  // const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const {
    data: apiData,
    loading: isLoading,
    isNetworkError,
    error: fetchError,
    refetch,
  } = useFetch<ApiDataType>(`/company/settings`);
  useRefetchOnEvent("refetch-settings", () => refetch({ silent: true }));

  useEffect(() => {
    if (apiData) {
      setData(apiData.data);
    }
  }, [apiData]);

  useEffect(() => {
    if (isNetworkError) {
      console.error("Network error occurred while fetching settings.");
    }
  }, [isNetworkError]);

  return (
    <SettingsContext.Provider value={{ data, isLoading, error }}>
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook to use the Settings context
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
