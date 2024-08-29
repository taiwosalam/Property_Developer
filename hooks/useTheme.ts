"use client";

import { useEffect } from "react";
import { useThemeStoreSelectors } from "@/store/themeStore";

const useThemeColors = () => {
  const setPrimaryColor = useThemeStoreSelectors.getState().setPrimaryColor;
  const setSecondaryColor = useThemeStoreSelectors.getState().setSecondaryColor;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const computedStyle = getComputedStyle(document.documentElement);
      setPrimaryColor(computedStyle.getPropertyValue("--primary-color").trim());
      setSecondaryColor(
        computedStyle.getPropertyValue("--secondary-color").trim()
      );
    }
  }, [setPrimaryColor, setSecondaryColor]);
};

export default useThemeColors;
