import {create, StateCreator } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

// Define the shape of your settings state
interface SelectedOptions {
  theme: "theme1" | "theme2" | "theme3" | null;
  view: "grid" | "list" | null;
  navbar: "column" | "row" | null;
  mode: "light" | "dark" | null;
  font: string | null;
}

interface SettingsStore {
  selectedOptions: SelectedOptions;
  setSelectedOption: (type: keyof SelectedOptions, value: string) => void;
}

type MyPersist = (
  config: StateCreator<SettingsStore>,
  options: PersistOptions<SettingsStore>
) => StateCreator<SettingsStore>;

// Create Zustand store with persistence
const useSettingsStore = create<SettingsStore>(
  (persist as MyPersist)(
    (set) => ({
      selectedOptions: {
        theme: "theme1",
        view: "grid",
        navbar: "column",
        mode: "light",
        font: "lato",
      },
      setSelectedOption: (type, value) =>
        set((state) => ({
          selectedOptions: {
            ...state.selectedOptions,
            [type]: value,
          },
        })),
    }),
    {
      name: "settings-storage", // Unique name for the 
    }
  )
);

export default useSettingsStore;