"use client";

import { createContext, useContext } from "react";

// Types
import type { TenantEditContextProps } from "../types";

export const TenantEditContext = createContext<
  TenantEditContextProps | undefined
>(undefined);

export const useTenantEditContext = () => {
  const context = useContext(TenantEditContext);

  if (!context) {
    throw new Error(
      "useTenantEditContext must be used within a TenantEditProvider"
    );
  }

  return context;
};
