import create from "zustand";

// Create Zustand store
const useSettingsStore = create((set: any) => ({
  selectedOptions: {
    theme: null,
    view: null,
    navbar: null,
    mode: null,
    font: null,
  },
  setSelectedOption: (type: string, value: string) =>
    set((state: any) => ({
      selectedOptions: {
        ...state.selectedOptions,
        [type]: value,
      },
    })),
}));

export default useSettingsStore;
