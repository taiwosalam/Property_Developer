export interface SelectOptionObject {
  value: string | number;
  label: string;
}

export interface SelectProps {
  id: string;
  defaultValue?: string;
  options: string[] | SelectOptionObject[];
  value?: string;
  label?: string;
  className?: string;
  required?: boolean;
  placeholder?: string;
  onChange?: (data: string) => void;
  validationErrors?: ValidationErrors;
  inputTextClassName?: string;
  allowCustom?: boolean;
  isSearchable?: boolean;
  hiddenInputClassName?: string;
  inputContainerClassName?: string;
  dropdownRefClassName?: string;
  resetKey?: number;
  requiredNoStar?: boolean;
}
