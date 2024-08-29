// Types
// import type { ValidationErrors } from "@/utils/types";

export interface DateInputProps {
  id: string;
  value?: string;
  label?: string;
  className?: string;
  required?: boolean;
  initialValue?: string;
  //   type?: React.HTMLInputTypeAttribute;
  //   validationErrors?: ValidationErrors;
  onChange?: (data: string) => void;
  textStyles?: string;
}
