import { CSSProperties } from "react";
import { StaticImageData } from "next/image";

// Types
import type { ValidationErrors } from "@/utils/types";

export interface RestrictedWordsOptions {
  words?: string[];
  hook?: () => string[];
  errorMessage?: string;
}
export interface InputProps {
  id: string;
  name?: string;
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
    // data: string | null,
    data: any,
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
  onKeyDown?: (e: React.KeyboardEvent<HTMLFormElement>) => void;
  restrictedWordsOptions?: RestrictedWordsOptions;
  prefix?: string | React.ReactNode;
  startAdornment?: string | React.ReactNode;
  endAdornment?: string | React.ReactNode;
}
