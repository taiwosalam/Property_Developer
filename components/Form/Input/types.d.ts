import { CSSProperties } from "react";
import { StaticImageData } from "next/image";

// Types
import type { ValidationErrors } from "@/utils/types";

export interface InputProps {
  id: string;
  value?: string;
  label?: string;
  leftIcon?: string | StaticImageData;
  className?: string;
  required?: boolean;
  placeholder?: string;
  initialValue?: string;
  style?: CSSProperties;
  type?: React.HTMLInputTypeAttribute;
  validationErrors?: ValidationErrors;
  onChange?: (data: string) => void;
  inputClassName?: string;
}
