"use client";
import { createContext, useContext } from "react";
import { UnitTypeKey } from "@/data";
import { UnitFormState } from "@/components/Management/Properties/unit-form";

interface UsePropertyRequestContextType extends UnitFormState {
  setUnitType: (unitType: "" | UnitTypeKey) => void;
  setSaved?: (saved: boolean) => void;
  duplicate?: {
    val: boolean;
    count: number;
  };
  setDuplicate?: (duplicate: { val: boolean; count: number }) => void;
}

export const PropertyRequestContext = createContext<
  UsePropertyRequestContextType | undefined
>(undefined);

export const usePropertyRequest = (): UsePropertyRequestContextType => {
  const context = useContext(PropertyRequestContext);

  if (!context) {
    throw new Error(
      "usePropertyRequest must be used within a PropertyRequestContextProvider"
    );
  }

  return context;
};
