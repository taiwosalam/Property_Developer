export interface TextAreaProps {
  id: string;
  value?: string;
  label?: string;
  className?: string;
  required?: boolean;
  placeholder?: string;
  onChange?: (data: string) => void;
  textAreaStyles?: string;
}
