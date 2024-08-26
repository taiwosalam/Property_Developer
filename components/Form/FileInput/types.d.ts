export interface FileInputProps {
  id: string;
  value: File;
  label?: string;
  className?: string;
  required?: boolean;
  placeholder: string;
  initialValue?: string;
  type?: React.HTMLInputTypeAttribute;
  validationErrors?: ValidationErrors;
  onChange?: (data: string) => void;
}