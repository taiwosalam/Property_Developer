export interface DateInputProps {
  id: string;
  value?: string;
  label?: string;
  className?: string;
  required?: boolean;
  placeholder: string;
  initialValue?: string;
  onChange?: (value: string) => void;
  inputTextStyles?: string;
}
