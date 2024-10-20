"use client";

import { useEffect } from "react";
import { useThemeStoreSelectors } from "@/store/themeStore";

const useThemeColors = () => {
  const setPrimaryColor = useThemeStoreSelectors.getState().setPrimaryColor;
  const setSecondaryColor = useThemeStoreSelectors.getState().setSecondaryColor;

  const computedStyle = getComputedStyle(document.documentElement);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Retrieve colors from localStorage
      const storedPrimaryColor = localStorage.getItem("primary-color");
      const storedSecondaryColor = localStorage.getItem("secondary-color");

      // If stored colors exist, set them; otherwise, use the CSS values
      if (storedPrimaryColor) {
        setPrimaryColor(storedPrimaryColor);
      } else {
        setPrimaryColor(
          computedStyle.getPropertyValue("--primary-color").trim()
        );
      }
      
      if (storedSecondaryColor) {
        setSecondaryColor(storedSecondaryColor);
      } else {
        setSecondaryColor(
          computedStyle.getPropertyValue("--secondary-color").trim()
        );
      }
    }
  }, [setPrimaryColor, setSecondaryColor]);
};

export default useThemeColors;
