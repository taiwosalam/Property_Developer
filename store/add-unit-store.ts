import { create } from "zustand";
import type { Categories } from "@/data";

interface PropertyDetails {
  property_title: string;
  state: string;
  local_govt: string;
  full_address: string;
  branch: string;
  account_officer: string;
  manager: string;
  category: Categories;
  desciption: string;
}
interface PropertySettings {
  agency_fee: string;
  period: string;
  charge: string;
  book_visitors: boolean;
  VAT: boolean;
  caution_deposit: string;
  group_chat: boolean;
  rent_penalty: boolean;
  request_callback: boolean;
  currency: string;
}

interface AddUnitStore {
  // propertyCreation: PropertyCreation;
  propertyDetails: null | PropertyDetails;
  propertySettings: null | PropertySettings;

  addedUnits: { [key: string]: FormDataEntryValue | File[] }[];
  addUnit: (
    unitData: { [key: string]: FormDataEntryValue | File[] },
    duplicateCount?: number
  ) => void;
  editUnit: (
    index: number,
    unitData: { [key: string]: FormDataEntryValue | File[] }
  ) => void;
  removeUnit: (index: number) => void;
}

export const useAddUnitStore = create<AddUnitStore>((set) => ({
  // propertyCreation: "rental property",
  propertyDetails: null,
  propertySettings: null,

  addedUnits: [],
  addUnit: (unitData, duplicateCount = 0) => {
    set((state) => {
      // perform post request and send unitDataWithImages along. ur response should come with the unit data u just added and use that to set d state of addedUnits
      const updatedUnits = [...state.addedUnits, unitData];
      // Step 3: Replicate the added unit if `duplicateCount` > 0.
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

// export const useAddUnitStoreSelectors = {
//   getState: useAddUnitStore.getState,
//   setState: useAddUnitStore.setState,
// };
