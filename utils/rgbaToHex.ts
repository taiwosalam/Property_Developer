export function rgbToHex(rgb: string): string | null {
  // Regular expression to match RGB/RGBA values
  const rgbArray = rgb.match(/\d+/g);

  // Validate input to ensure we have three values for RGB
  if (!rgbArray || rgbArray.length < 3) return null;

  // Convert each RGB value to hex and ensure it's two digits
  const hex = rgbArray
    .slice(0, 3)
    .map((value) => {
      const hexValue = parseInt(value, 10).toString(16);
      return hexValue.length === 1 ? "0" + hexValue : hexValue;
    })
    .join("");

  return `#${hex}`;
}

export function rgbaToHex(rgba: string): string | null {
  const rgbaArray = rgba.match(/\d+(\.\d+)?/g);

  // Validate input to ensure we have four values for RGBA
  if (!rgbaArray || rgbaArray.length < 4) return null;

  // Convert RGB values to hex
  const hex = rgbaArray
    .slice(0, 3)
    .map((value) => {
      const hexValue = parseInt(value, 10).toString(16);
      return hexValue.length === 1 ? "0" + hexValue : hexValue;
    })
    .join("");

  // Convert alpha value to hex (0-255)
  const alpha = Math.round(parseFloat(rgbaArray[3]) * 255);
  const alphaHex = alpha.toString(16).padStart(2, "0");

  return `#${hex}${alphaHex}`;
}

export function hexToRgb(hex: string): string | null {
  // Remove the hash at the start if it's there
  if (hex.startsWith("#")) {
    hex = hex.slice(1);
  }

  // Validate HEX format
  const hexRegex = /^(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
  if (!hexRegex.test(hex)) {
    return null; // Invalid HEX format
  }

  let r: number,
    g: number,
    b: number,
    a: number = 1; // Default alpha to 1

  // Parse RGB values
  if (hex.length === 6) {
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  } else {
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
    a = parseInt(hex.slice(6, 8), 16) / 255; // Convert alpha to decimal
  }

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
