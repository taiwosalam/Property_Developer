export interface TextAreaProps {
  id: string;
  value?: string;
  label?: string;
  className?: string;
  required?: boolean;
  placeholder?: string;
  initialValue?: string;
  onChange?: (data: string) => void;
  textAreaStyles?: string;
}
