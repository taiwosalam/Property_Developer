import { createContext, useContext } from "react";
import { Dayjs } from "dayjs";
import {
  initDataProps,
} from "@/app/(nav)/management/rent-unit/data";
import { Currency } from "@/utils/number-formatter";

interface PropertyData {
  id: string;
  property_name: string;
  total_units: number;
  address: string;
  local_government: string;
  state: string;
  images: string[];
  video_link?: string;
  isRental: boolean;
  units: Array<{
    unitId: string;
    unitStatus: "vacant" | "relocate" | string;
    [key: string]: any;
  }>;
  [key: string]: any;
}

interface ChangePropertyContextProps {
  propertyId: string | null;
  propertyType: "rental" | "facility";
  propertyData: PropertyData | null;
  setPropertyData: (data: PropertyData | null) => void;
  selectedUnitId: string | null;
  setSelectedUnitId: (id: string | null) => void;
  unitData: initDataProps;
  setUnitData: (data: initDataProps) => void;
  startDate: string | null;
  setStartDate: (date: string | null) => void;
  reqLoading: boolean;
  setReqLoading: (loading: boolean) => void;
  step1Done: boolean;
  setStep1Done: (done: boolean) => void;
  calculation: boolean;
  deduction: boolean;
}

export const ChangePropertyContext = createContext<
  ChangePropertyContextProps | undefined
>(undefined);

export const useChangePropertyContext = () => {
  const context = useContext(ChangePropertyContext);
  if (!context) {
    throw new Error(
      "useChangePropertyContext must be used within a ChangePropertyContextProvider"
    );
  }
  return context;
};
