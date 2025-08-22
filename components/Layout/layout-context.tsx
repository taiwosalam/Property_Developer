"use client";

import { createContext, useContext } from "react";

export const LayoutContext = createContext<{ isSideNavOpen: boolean }>({
  isSideNavOpen: false,
});

export const useLayout = () => {
  const context = useContext(LayoutContext);

  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }

  return context;
};
