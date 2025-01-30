export interface SelectOptionObject {
  value: string | number;
  label: string;
  icon?: string;
}

export interface SelectProps {
  id: string;
  name?: string;
  defaultValue?: string | SelectOptionObject;
  options: (string | SelectOptionObject)[];
  value?: string | SelectOptionObject;
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
  disabled?: boolean;
  error?: string | null;
}
