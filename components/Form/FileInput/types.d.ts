export interface FileInputProps {
  id: string;
  label?: string;
  className?: string;
  required?: boolean;
  placeholder?: string;
  buttonName?: string;
  onChange?: (value: File) => void;
}
