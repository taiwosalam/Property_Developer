import { CSSProperties } from "react";
import { StaticImageData } from "next/image";

// Types
import type { ValidationErrors } from "@/utils/types";

export interface InputProps {
  id: string;
  value?: string | number | readonly string[] | undefined;
  label?: string;
  leftIcon?: string | StaticImageData;
  className?: string;
  required?: boolean;
  placeholder?: string;
  initialValue?: string;
  defaultValue?: string | null;
  style?: CSSProperties;
  type?: React.HTMLInputTypeAttribute;
  validationErrors?: ValidationErrors;
  onChange?: (
    data: string,
    event?: React.ChangeEvent<HTMLInputElement>
  ) => void;
  inputClassName?: string;
  CURRENCY_SYMBOL?: string;
  readOnly?: boolean;
  disabled?: boolean;
  min?: number;
  max?: number;
  labelclassName?: string;
  maxLength?: number;
  requiredNoStar?: boolean;
  formatNumber?: boolean;
  endWith?: string;
  isPinField?: boolean;
  minLength?: number;
}
