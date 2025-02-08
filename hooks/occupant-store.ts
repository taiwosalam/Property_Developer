import { Occupant } from "@/components/Management/Rent And Unit/types";
import { create } from "zustand";

interface OccupantState {
  occupant: Occupant | null;
  propertyData: any | null;
  records: any | null;
  setOccupant: (occupant: Occupant) => void;
  setPropertyData: (propertyData: any) => void;
  setRecords: (records: any) => void;
}

export const useOccupantStore = create<OccupantState>((set) => ({
  occupant: null,
  records: null,
  propertyData: null,
  setOccupant: (occupant) => set({ occupant }),
  setPropertyData: (propertyData) => set({ propertyData }),
  setRecords: (records) => set({ records }),
}));
