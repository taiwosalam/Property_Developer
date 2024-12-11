import { create } from "zustand";
import type { Categories } from "@/data";
import { currencySymbols } from "@/utils/number-formatter";
import type { AddUnitPayload } from "@/components/Management/Properties/types";

const initialState = {
  property_id: null,
  propertyType: null,
  propertyDetails: null,
  propertySettings: null,
  addedUnits: [],
};

type PropertyType = "rental" | "facility" | null;
type StoreAddedUnit = AddUnitPayload & { notYetUploaded?: boolean };

interface PropertyDetails {
  property_title: string;
  video_link?: string;
  state: string;
  local_govt: string;
  city: string;
  full_address: string;
  branch?: string;
  account_officer?: string;
  manager?: string;
  category: Categories;
  description: string;
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
  rent_penalty?: "Yes" | "No"; // for rental
  fee_penalty?: "Yes" | "No"; // for facility
  request_callback?: "Yes" | "No";
  vehicle_record?: "Yes" | "No";
  currency?: keyof typeof currencySymbols | null;
  coordinate?: string;
}

export interface AddUnitStore {
  property_id: string | null;
  propertyType: PropertyType;
  propertyDetails: null | PropertyDetails;
  propertySettings: null | PropertySettings;
  addedUnits: StoreAddedUnit[];
  resetStore: () => void;
  setAddUnitStore: <
    K extends keyof Omit<
      AddUnitStore,
      "setAddUnitStore" | "addUnit" | "editUnit" | "removeUnit"
    >
  >(
    key: K,
    value: AddUnitStore[K]
  ) => void;
  addUnit: (unitData: AddUnitPayload, duplicateCount?: number) => void;
  editUnit: (
    index: number,
    unitData: { [key: string]: FormDataEntryValue | FormDataEntryValue[] }
  ) => void;
  removeUnit: (index: number) => void;
}

export const useAddUnitStore = create<AddUnitStore>((set) => ({
  ...initialState,
  resetStore: () => set(initialState),

  setAddUnitStore: (key, value) => {
    set({ [key]: value });
  },
  addUnit: (unitData, duplicateCount = 0) => {
    set((state) => {
      const updatedUnits: StoreAddedUnit[] = [...state.addedUnits, unitData];

      const replicatedUnits: StoreAddedUnit[] = Array(duplicateCount).fill({
        ...unitData,
        images: [],
        notYetUploaded: true,
      });

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
