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
      let newLightness = primaryHsl.lightness + lightnessDifference;
      // Ensure the new lightness does not exceed 0.90 to avoid fading to white
      newLightness = Math.min(newLightness, 0.9);
      return `hsl(${primaryHsl.hue}, ${primaryHsl.saturation * 100}%, ${
        newLightness * 100
      }%)`;
    };

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
