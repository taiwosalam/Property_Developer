export interface FileInputProps {
  id: string;
  label?: string;
  className?: string;
  textStyles?: string;
  required?: boolean;
  placeholder?: string;
  buttonName?: string;
  fileType?: string;
  size: number;
  sizeUnit: "KB" | "MB";
  onChange?: (value: File | null) => void;
}
