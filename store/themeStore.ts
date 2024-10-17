import { create } from "zustand";
import { Color } from "@/types/global"; // Ensure this is correctly set in your project
import { createSelectors } from "./storeSelectors";
import { hexToRgb } from "@/utils/rgbaToHex";

// Define the store's state and actions
interface ThemeState {
  primaryColor: string;
  secondaryColor: string;

  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
  setColor: (color: string) => void; // Add the method to set both colors
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

  setColor: (color: string) => {
    // Calculate secondary color with alpha 0.7
    const alpha = 0.7;
    const rgbaColor = hexToRgb(color); // Get rgba format
    const rgbaParts = rgbaColor ? rgbaColor.match(/\d+(\.\d+)?/g) : null;

    if (rgbaParts) {
      const secondaryColor = `rgba(${rgbaParts[0]}, ${rgbaParts[1]}, ${rgbaParts[2]}, ${alpha})`;

      localStorage.setItem("primary-color", color);
      document.documentElement.style.setProperty("--primary-color", color);

      localStorage.setItem("secondary-color", secondaryColor);
      document.documentElement.style.setProperty(
        "--secondary-color",
        secondaryColor
      );

      // Return the new state
      return set({
        primaryColor: color,
        secondaryColor: secondaryColor,
      });
    }
  },
}));

export const useThemeStoreSelectors = createSelectors(useThemeStore);
