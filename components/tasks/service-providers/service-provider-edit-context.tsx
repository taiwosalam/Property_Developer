"use client";

import { createContext, useContext } from "react";
import type { ServiceProviderData } from "@/app/(nav)/management/service-providers/[serviceProviderId]/manage/types";

interface ServiceProviderEditContextProps {
  data: ServiceProviderData | null;
}

export const ServiceProviderEditContext = createContext<
  ServiceProviderEditContextProps | undefined
>(undefined);

export const useServiceProviderEditContext = () => {
  const context = useContext(ServiceProviderEditContext);

  if (!context) {
    throw new Error(
      "useServiceProviderEditContext must be used within a ServiceProviderEditProvider"
    );
  }

  return context;
};
