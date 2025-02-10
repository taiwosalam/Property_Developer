import { Occupant } from "@/components/Management/Rent And Unit/types";
import { create } from "zustand";

interface OccupantState {
  occupant: Occupant | null;
  propertyData: any | null;
  records: any | null;
  unit: any | null;
  unitBalance: any | null;
  setUnitBalance: (balance: any) => void;
  setUnit: (unit: any) => void;
  setOccupant: (occupant: Occupant) => void;
  setPropertyData: (propertyData: any) => void;
  setRecords: (records: any) => void;
  calculation: boolean;
  deduction: boolean;
  setCalculation: (value: boolean) => void;
  setDeduction: (value: boolean) => void;
}

export const useOccupantStore = create<OccupantState>((set) => ({
  occupant: null,
  unit: null,
  records: null,
  propertyData: null,
  unitBalance: null,
  calculation: false,
  deduction: false,
  setCalculation: (value) => set({ calculation: value }),
  setDeduction: (value) => set({ deduction: value }),
  setUnitBalance: (balance) => set({ unitBalance: balance }),
  setOccupant: (occupant) => set({ occupant }),
  setPropertyData: (propertyData) => set({ propertyData }),
  setRecords: (records) => set({ records }),
  setUnit: (unit) => set({ unit }),
}));
