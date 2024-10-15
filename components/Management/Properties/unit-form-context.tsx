"use client";
import { createContext, useContext } from "react";
import { UnitTypeKey } from "@/data";
import { UnitFormState } from "./unit-form";

interface UnitFormContextType extends UnitFormState {
  setImages: (newImages: string[], options?: { append: boolean }) => void;
  removeImage: (index: number) => void;
  setUnitType: (unitType: "" | UnitTypeKey) => void;
  setSaved?: (saved: boolean) => void;
  duplicate?: {
    val: boolean;
    count: number;
  };
  setDuplicate?: (duplicate: { val: boolean; count: number }) => void;
}

export const UnitFormContext = createContext<UnitFormContextType | undefined>(
  undefined
);

export const useUnitForm = (): UnitFormContextType => {
  const context = useContext(UnitFormContext);

  if (!context) {
    throw new Error(
      "useUnitForm must be used within a UnitFormContextProvider"
    );
  }

  return context;
};
