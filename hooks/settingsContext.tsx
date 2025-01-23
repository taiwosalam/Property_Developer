import React, { createContext, useContext, useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import api from "@/services/api";

interface SettingsContextType {
  data: any;
  isLoading: boolean;
  error: string | null;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response: AxiosResponse = await api.get("/company/settings"); 
        if (response.data?.status) {
          setData(response.data.data);
        } else {
          setError(response.data?.message || "Failed to fetch settings.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
