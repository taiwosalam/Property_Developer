"use client";

import { useEffect } from "react";
import { useThemeStoreSelectors } from "@/store/themeStore";

const useThemeColors = () => {
  const setColor = useThemeStoreSelectors.getState().setColor;

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Retrieve colors from localStorage
      const storedPrimaryColor = localStorage.getItem("primary-color");

      // If stored colors exist, set them; otherwise, use the CSS values
      if (storedPrimaryColor) {
        setColor(storedPrimaryColor);
      } else {
        const computedStyle = getComputedStyle(document.documentElement);
        setColor(computedStyle.getPropertyValue("--primary-color").trim());
      }
    }
  }, [setColor]);
};

export default useThemeColors;
