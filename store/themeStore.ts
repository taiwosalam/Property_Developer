import { create } from "zustand";

import { Color } from "@/types/global";
import { createSelectors } from "./storeSelectors";

// Define the store's state and actions
interface ThemeState {
  primaryColor: string;
  secondaryColor: string;

  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  primaryColor: "",
  secondaryColor: "",
  setPrimaryColor: (color: string) => {
    set({ primaryColor: color });
    localStorage.setItem("primary-color", color);
    document.documentElement.style.setProperty("--primary-color", color);
  },
  setSecondaryColor: (color: string) => {
    set({ secondaryColor: color });
    localStorage.setItem("secondary-color", color);
    document.documentElement.style.setProperty("--secondary-color", color);
  },
}));

export const useThemeStoreSelectors = createSelectors(useThemeStore);
