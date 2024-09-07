import { DM_Sans, Lato } from "next/font/google";

export const primaryFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const secondaryFont = Lato({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["100", "300", "400", "700", "900"],
});
