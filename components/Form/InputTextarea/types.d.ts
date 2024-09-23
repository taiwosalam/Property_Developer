import { CSSProperties } from "react";

export interface InputTextareaProps {
  id: string;
  value?: string;
  label?: string;
  className?: string;
  required?: boolean;
  placeholder?: string;
  style?: CSSProperties;
  onChange?: (data: string) => void;
  textAreaClassName?: string;
  disabled?: boolean;
  rows?: number;
}
