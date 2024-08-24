// Color
export type HexColor = `#${string}`;
export type RgbColor = `rgb(${number},${number},${number})`;
export type RgbaColor = `rgba(${number},${number},${number},${number})`;
export type HslColor = `hsl(${number},${number}%,${number}%)`;
export type HslaColor = `hsla(${number},${number}%,${number}%,${number})`;

export type Color = HexColor | RgbColor | RgbaColor | HslColor | HslaColor;
