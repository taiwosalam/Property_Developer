// Types
// import type { ValidationErrors } from "@/utils/types";

export interface DateInputProps {
  id: string;
  value?: Date;
  label?: string;
  className?: string;
  hiddenInputClassName?: string;
  required?: boolean;
  //   validationErrors?: ValidationErrors;
  onChange?: (date: Date | undefined) => void;
  textStyles?: string;
}
