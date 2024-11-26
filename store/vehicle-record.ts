import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SelectStore {
  selectedProperty: string;
  setSelectedProperty: (option: string) => void;
}

const useVehicleRecordStore = create<SelectStore>()(
  persist(
    (set) => ({
      selectedProperty: "",
      setSelectedProperty: (option: string) =>
        set({ selectedProperty: option }),
    }),
    {
      name: "vehicle-record-store", // Unique name for localStorage key
      getStorage: () => localStorage, // Use localStorage for persistence
    }
  )
);

export default useVehicleRecordStore;
