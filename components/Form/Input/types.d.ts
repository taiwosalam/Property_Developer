// Types
import type { ValidationErrors } from "@/utils/types";

export interface InputProps {
  id: string;
  value?: string;
  label?: string;
  placeholder: string;
  initialValue?: string;
  type?: React.HTMLInputTypeAttribute;
  validationErrors: ValidationErrors;
  onChange?: (data: string) => void;
}
