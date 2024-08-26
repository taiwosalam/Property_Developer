// Types
import type { ValidationErrors } from "@/utils/types";

export interface InputProps {
  id: string;
  value?: string;
  label?: string;
  className?: string;
  required?: boolean;
  placeholder: string;
  initialValue?: string;
  type?: React.HTMLInputTypeAttribute;
  validationErrors?: ValidationErrors;
  onChange?: (data: string) => void;
}
