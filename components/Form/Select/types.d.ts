export interface SelectProps {
  id: string;
  options: string[];
  value?: string;
  label?: string;
  className?: string;
  required?: boolean;
  placeholder?: string;
  onChange?: (data: string) => void;
  inputTextStyles?: string;
  allowCustom?: booleab;
  hiddenInputClassName?: string;
}
