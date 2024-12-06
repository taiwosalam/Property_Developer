import { create } from "zustand";
import type { Categories } from "@/data";
import { currencySymbols } from "@/utils/number-formatter";

type PropertyType = "rental" | "facility" | null;

interface PropertyDetails {
  property_title: string;
  state: string;
  local_govt: string;
  full_address: string;
  branch?: string;
  account_officer?: string;
  manager?: string;
  category: Categories;
  desciption: string;
  images: string[];
}
interface PropertySettings {
  agency_fee?: number;
  management_fee?: number;
  who_to_charge_new_tenant?: string;
  who_to_charge_renew_tenant?: string;
  book_visitors?: "Yes" | "No";
  VAT?: "Yes" | "No";
  caution_deposit?: string;
  group_chat?: "Yes" | "No";
  rent_penalty?: "Yes" | "No";
  request_callback?: "Yes" | "No";
  vehicle_record?: "Yes" | "No";
  currency?: keyof typeof currencySymbols | null;
}

export interface AddUnitStore {
  property_id: string | null;
  propertyType: PropertyType;
  propertyDetails: null | PropertyDetails;
  propertySettings: null | PropertySettings;
  addedUnits: { [key: string]: FormDataEntryValue | FormDataEntryValue[] }[];
  setAddUnitStore: <
    K extends keyof Omit<
      AddUnitStore,
      "setAddUnitStore" | "addUnit" | "editUnit" | "removeUnit"
    >
  >(
    key: K,
    value: AddUnitStore[K]
  ) => void;
  addUnit: (
    unitData: { [key: string]: FormDataEntryValue | FormDataEntryValue[] },
    duplicateCount?: number
  ) => void;
  editUnit: (
    index: number,
    unitData: { [key: string]: FormDataEntryValue | FormDataEntryValue[] }
  ) => void;
  removeUnit: (index: number) => void;
}

export const useAddUnitStore = create<AddUnitStore>((set) => ({
  property_id: null,
  propertyType: null,
  propertyDetails: null,
  propertySettings: null,
  addedUnits: [],
  setAddUnitStore: (key, value) => {
    set({ [key]: value });
  },
  addUnit: (unitData, duplicateCount = 0) => {
    set((state) => {
      // perform post request should come with the unit data u just added and use that to set d state of addedUnits
      const updatedUnits = [...state.addedUnits, unitData];
      // Replicate the added unit if `duplicateCount` > 0.
      const replicatedUnits = Array(duplicateCount).fill(unitData);

      return {
        addedUnits: [...updatedUnits, ...replicatedUnits],
      };
    });
  },
  removeUnit: (index) =>
    set((state) => ({
      // communicate with API and remove d unit
      addedUnits: state.addedUnits.filter((_, i) => i !== index),
    })),
  editUnit: (index, unitData) => {
    set((state) => {
      // communicate with API and edit d unit
      const updatedUnits = state.addedUnits.map((unit, i) =>
        i === index ? { ...unit, ...unitData } : unit
      );
      // console.log("Updated addedUnits:", updatedUnits);
      return {
        addedUnits: updatedUnits,
      };
    });
  },
}));
