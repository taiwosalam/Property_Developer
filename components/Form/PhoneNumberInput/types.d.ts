
export interface PhoneNumberProps {
  id: string;
  value?: string;
  defaultValue?: string;
  label?: string;
  resetKey?: number;
  className?: string;
  required?: boolean;
  placeholder?: string;
  onChange?: (data: string) => void;
  inputClassName?: string;
  inputContainerClassName?: string;
  disabled?: boolean;
}
