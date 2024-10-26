import { parseToHsl } from "polished";

export const defaultColor = "#0033c4";

export const defaultColorsMap = {
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
};

export const setCSSVariables = (variables: Record<string, string>) => {
  const root = document.documentElement;
  Object.entries(variables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};

export const updateBrandColors = (primaryColor: string) => {

  if (primaryColor.toLowerCase() === defaultColor) {
    // Use default CSS values
    setCSSVariables(defaultColorsMap);
  } else {
    const baseHsl = parseToHsl(defaultColor);
    const primaryHsl = parseToHsl(primaryColor);

    const calculateRelativeColor = (defaultHex: string) => {
      const defaultHsl = parseToHsl(defaultHex);
      const lightnessDifference = defaultHsl.lightness - baseHsl.lightness;
      const newLightness = primaryHsl.lightness + lightnessDifference;
      return `hsl(${primaryHsl.hue}, ${primaryHsl.saturation * 100}%, ${
        newLightness * 100
      }%)`;
    };

    // const brand1 = lighten(0.8, primaryColor); // Lighten by 80%
    // const brand2 = lighten(0.6, primaryColor); // Lighten by 60%
    // const brand3 = lighten(0.4, primaryColor); // Lighten by 40%
    // const brand5 = lighten(0.2, primaryColor); // Lighten by 20%
    // const brand7 = lighten(0.1, primaryColor); // Lighten by 10%
    // const brand10 = darken(0.1, primaryColor); // Darken by 20%
    // const brandPrimary = lighten(0.15, primaryColor); // Lighten by 15%
    // const brandSecondary = lighten(0.25, primaryColor); // Lighten by 25%
    // const brandTertiary = lighten(0.35, primaryColor); // Lighten by 35%

    const customColors = {
      "--brand-1": calculateRelativeColor(defaultColorsMap["--brand-1"]),
      "--brand-2": calculateRelativeColor(defaultColorsMap["--brand-2"]),
      "--brand-3": calculateRelativeColor(defaultColorsMap["--brand-3"]),
      "--brand-5": calculateRelativeColor(defaultColorsMap["--brand-5"]),
      "--brand-7": calculateRelativeColor(defaultColorsMap["--brand-7"]),
      "--brand-9": primaryColor,
      "--brand-10": calculateRelativeColor(defaultColorsMap["--brand-10"]),
      "--brand-primary": calculateRelativeColor(
        defaultColorsMap["--brand-primary"]
      ),
      "--brand-secondary": calculateRelativeColor(
        defaultColorsMap["--brand-secondary"]
      ),
      "--brand-tertiary": calculateRelativeColor(
        defaultColorsMap["--brand-tertiary"]
      ),
    };

    setCSSVariables(customColors);
  }
};
