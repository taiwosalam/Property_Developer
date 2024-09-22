export interface SelectProps {
  id: string;
  options: string[];
  value?: string;
  label?: string;
  className?: string;
  required?: boolean;
  placeholder?: string;
  onChange?: (data: string) => void;
  validationErrors?: ValidationErrors;
  inputTextClassName?: string;
  allowCustom?: booleab;
  isSearchable?: boolean;
  hiddenInputClassName?: string;
  inputContainerClassName?: string;
  dropdownRefClassName?: string;
  resetKey?: number;
}
