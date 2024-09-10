// Imports
import { button_variants } from "./data";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

export type ButtonSize = keyof typeof button_variants.size;
type ButtonVariant = keyof typeof button_variants.variant;
