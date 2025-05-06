import { Occupant } from "@/components/Management/Rent And Unit/types";
import { create } from "zustand";

interface OccupantState {
  occupant: Occupant | null;
  propertyData: any | null;
  records: any | null;
  unit: any | null;
  unitBalance: any | null;
  propertyType: string | null;
  propertyId: string | null;
  unitData: any | null;
  page: string | null;
  selectedUnitId: string | null;
  calculation: boolean;
  deduction: boolean;
  reqLoading: boolean;
  startDate: string | null;
  modalIsOpen: boolean;
  setSelectedUnitId: (unitId: string | null) => void;
  setPage: (page: string | null) => void;
  setUnitData: (data: any) => void;
  setPropertyType: (propertyType: string | null) => void;
  setPropertyId: (propertyId: string | null) => void;
  setUnitBalance: (balance: any) => void;
  setUnit: (unit: any) => void;
  setOccupant: (occupant: Occupant) => void;
  setPropertyData: (propertyData: any) => void;
  setRecords: (records: any) => void;
  setCalculation: (value: boolean) => void;
  setDeduction: (value: boolean) => void;
  setReqLoading: (loading: boolean) => void;
  setStartDate: (date: string | null) => void;
  setModalIsOpen: (isOpen: boolean) => void;
}

export const useOccupantStore = create<OccupantState>((set) => ({
  occupant: null,
  propertyType: null,
  unit: null,
  records: null,
  propertyData: null,
  unitBalance: null,
  unitData: null,
  page: null,
  selectedUnitId: null,
  propertyId: null,
  calculation: false,
  deduction: false,
  reqLoading: false,
  startDate: null,
  modalIsOpen: false,
  setSelectedUnitId: (unitId) => set({ selectedUnitId: unitId }),
  setPage: (page) => set({ page }),
  setUnitData: (data) => set({ unitData: data }),
  setPropertyType: (propertyType) => set({ propertyType }),
  setPropertyId: (propertyId) => set({ propertyId }),
  setUnitBalance: (balance) => set({ unitBalance: balance }),
  setOccupant: (occupant) => set({ occupant }),
  setPropertyData: (propertyData) => set({ propertyData }),
  setRecords: (records) => set({ records }),
  setUnit: (unit) => set({ unit }),
  setCalculation: (value) => set({ calculation: value }),
  setDeduction: (value) => set({ deduction: value }),
  setReqLoading: (loading) => set({ reqLoading: loading }),
  setStartDate: (date) => set({ startDate: date }),
  setModalIsOpen: (isOpen) => set({ modalIsOpen: isOpen }),
}));
