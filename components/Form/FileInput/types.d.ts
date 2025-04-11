export interface FileInputProps {
  id: string;
  label?: string;
  className?: string;
  hiddenInputClassName?: string;
  textStyles?: string;
  required?: boolean;
  placeholder?: string;
  buttonName?: string;
  fileType?: string;
  size: number;
  sizeUnit: "KB" | "MB";
  settingsPage?: boolean;
  defaultValue?: string;
  noUpload?: boolean;
  membership_status?: "verified" | "unverified" | "pending";
}
