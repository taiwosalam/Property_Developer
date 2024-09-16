export interface SelectProps {
  id: string;
  options: string[];
  value?: string;
  label?: string;
  className?: string;
  required?: boolean;
  placeholder?: string;
  onChange?: (data: string) => void;
  inputTextClassName?: string;
  allowCustom?: booleab;
  isSearchable?: boolean;
  hiddenInputClassName?: string;
  inputContainerClassName?: string;
  dropdownRefClassName?: string;
  resetKey?: number;
}
