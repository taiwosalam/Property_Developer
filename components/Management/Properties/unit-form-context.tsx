"use client";
import { createContext, useContext } from "react";
import { UnitTypeKey } from "@/data";
import { UnitFormState } from "./unit-form";
import { type UnitDataObject } from "@/app/(nav)/management/properties/data";

interface UnitFormContextType extends UnitFormState {
  setImages: (a: { images: string[]; imageFiles: (File | string)[] }) => void;
  submitLoading: boolean;
  setSubmitLoading?: (loading: boolean) => void;
  setSaveClick: (saveClick: boolean) => void;
  setUnitType: (unitType: "" | UnitTypeKey) => void;
  resetForm: () => void;
  duplicate?: {
    val: boolean;
    count: number;
  };
  setDuplicate?: (duplicate: { val: boolean; count: number }) => void;
  isEditing?: boolean;
  setIsEditing?: (isEditing: boolean) => void;
  unitData?: UnitDataObject;
  index?: number;
  clickedNo?: boolean;
  setClickedNo?: (clicked: boolean) => void; 
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
