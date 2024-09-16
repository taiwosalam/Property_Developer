import { create } from "zustand";
import type { Categories, PropertyCreation, UnitTypeKey } from "@/data";

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
  images: File[];
  addImages: (newImages: File[]) => void;
  removeImage: (index: number) => void;
  unitType: "" | UnitTypeKey;
  setUnitType: (unitType: UnitTypeKey) => void;
}

export const useAddUnitStore = create<AddUnitStore>((set) => ({
  // propertyCreation: "rental property",
  propertyDetails: null,
  propertySettings: null,
  images: [],
  addImages: (newImages) =>
    set((state) => {
      // Limit the number of images to a maximum of 14
      const totalImages = state.images.length + newImages.length;
      if (totalImages > 14) {
        const allowedImages = newImages.slice(0, 14 - state.images.length);
        return { images: [...state.images, ...allowedImages] };
      }
      return { images: [...state.images, ...newImages] };
    }),
  removeImage: (index) =>
    set((state) => ({
      images: state.images.filter((_, i) => i !== index),
    })),
  unitType: "",
  setUnitType: (unitType: UnitTypeKey) => set(() => ({ unitType })),
}));

// export const useAddUnitStoreSelectors = {
//   getState: useAddUnitStore.getState,
//   setState: useAddUnitStore.setState,
// };
