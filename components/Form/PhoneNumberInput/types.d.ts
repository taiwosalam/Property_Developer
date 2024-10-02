export interface PhoneNumberProps {
  id: string;
  value?: string;
  label?: string;
  className?: string;
  required?: boolean;
  placeholder?: string;
  onChange?: (data: string) => void;
  inputClassName?: string;
  inputContainerClassName?: string;
}
