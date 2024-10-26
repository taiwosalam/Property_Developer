import { create } from "zustand";
import { createSelectors } from "./storeSelectors";
import { hexToRgb, rgbToHex } from "@/utils/rgbaToHex";
import { setCSSVariables, updateBrandColors } from "@/utils/updateBrandColors";

// Define the store's state and actions
interface ThemeState {
  primaryColor: string;
  secondaryColor: string;

  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
  setColor: (color: string) => void; // Add the method to set both colors
}

export const useThemeStore = create<ThemeState>((set) => ({
  
  primaryColor: localStorage.getItem("primary-color") || "", // Check localStorage for initial value
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
    let hexColor: string | null;
    let rgbColor: string | null;

    // Determine if the color is in hex or RGB format
    if (color.startsWith("#")) {
      hexColor = color;
      rgbColor = hexToRgb(color);
    } else {
      // Assume color is in RGB format
      rgbColor = color;
      hexColor = rgbToHex(color);
    }
    if (rgbColor && hexColor) {
      const alpha = 0.4;
      const rgbParts = rgbColor.match(/\d+(\.\d+)?/g);
      if (rgbParts) {
        const secondaryColor = `rgba(${rgbParts[0]}, ${rgbParts[1]}, ${rgbParts[2]}, ${alpha})`;

        localStorage.setItem("primary-color", hexColor);

        setCSSVariables({
          "--primary-color": hexColor,
          "--secondary-color": secondaryColor,
        });
        updateBrandColors(hexColor);
        // Return the new state
        return set({
          primaryColor: hexColor,
          secondaryColor: secondaryColor,
        });
      }
    }
  },
}));

export const useThemeStoreSelectors = createSelectors(useThemeStore);
