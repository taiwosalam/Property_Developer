import create from 'zustand';

interface SelectStore {
  selectedProperty: string;
  setSelectedProperty: (option: string) => void;
}

const useVehicleRecordStore = create<SelectStore>((set) => ({
  selectedProperty: "",
  setSelectedProperty: (option) => set({ selectedProperty: option }),
}));

export default useVehicleRecordStore;
