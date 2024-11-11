import create, { StateCreator } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

// Define the shape of your settings state
interface SelectedOptions {
  theme: string | null;
  view: string | null;
  navbar: string | null;
  mode: string | null;
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
        theme: null,
        view: null,
        navbar: null,
        mode: null,
        font: null,
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