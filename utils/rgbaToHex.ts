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
