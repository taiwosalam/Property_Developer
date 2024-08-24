// Imports
import { button_variants } from "./data";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: ButtonVariant;
}

type ButtonSize = keyof typeof button_variants.size;
type ButtonVariant = keyof typeof button_variants.variant;
