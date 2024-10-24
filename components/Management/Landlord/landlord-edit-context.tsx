"use client";

import { createContext, useContext } from "react";
import type { LandlordPageData } from "@/app/(nav)/management/landlord/types";

interface LandlordEditContextProps {
  data: LandlordPageData | null;
}

export const LandlordEditContext = createContext<
  LandlordEditContextProps | undefined
>(undefined);

export const useLandlordEditContext = () => {
  const context = useContext(LandlordEditContext);

  if (!context) {
    throw new Error(
      "useLandlordEditContext must be used within a LandlordEditProvider"
    );
  }

  return context;
};
