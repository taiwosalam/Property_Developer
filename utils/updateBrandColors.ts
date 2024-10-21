import { lighten, darken } from "polished";

export const setCSSVariables = (variables: Record<string, string>) => {
  const root = document.documentElement;
  Object.entries(variables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};

export const updateBrandColors = (primaryColor: string) => {
  const defaultColor = "#0033c4";
  if (primaryColor.toLowerCase() === defaultColor) {
    // Use default CSS values
    setCSSVariables({
      "--brand-1": "#eff6ff",
      "--brand-2": "#dbeafe",
      "--brand-3": "#bfdbfe",
      "--brand-5": "#60a5fa",
      "--brand-7": "#2563eb",
      "--brand-9": defaultColor,
      "--brand-10": "#1e3a8a",
      "--brand-primary": "#315ee7",
      "--brand-secondary": "#6083ed",
      "--brand-tertiary": "#93c5fd",
    });
  } else {
    const brand1 = lighten(0.8, primaryColor); // Lighten by 80%
    const brand2 = lighten(0.6, primaryColor); // Lighten by 60%
    const brand3 = lighten(0.4, primaryColor); // Lighten by 40%
    const brand5 = lighten(0.2, primaryColor); // Lighten by 20%
    const brand7 = lighten(0.1, primaryColor); // Lighten by 10%
    const brand10 = darken(0.1, primaryColor); // Darken by 20%
    const brandPrimary = lighten(0.15, primaryColor); // Lighten by 15%
    const brandSecondary = lighten(0.25, primaryColor); // Lighten by 25%
    const brandTertiary = lighten(0.35, primaryColor); // Lighten by 35%

    setCSSVariables({
      "--brand-1": brand1,
      "--brand-2": brand2,
      "--brand-3": brand3,
      "--brand-5": brand5,
      "--brand-7": brand7,
      "--brand-9": primaryColor,
      "--brand-10": brand10,
      "--brand-primary": brandPrimary,
      "--brand-secondary": brandSecondary,
      "--brand-tertiary": brandTertiary,
    });
  }
};
