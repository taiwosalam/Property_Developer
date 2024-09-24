export interface TextAreaProps {
  id: string;
  value?: string;
  label?: string;
  defaultValue?: string;
  className?: string;
  required?: boolean;
  hiddenInputClassName?: string;
  placeholder?: string;
  inputSpaceClassName?: string;
  onChange?: (data: string) => void;
  resetKey?: number;
}
