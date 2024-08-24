// Types
import type { ValidationErrors, ValidationOutput } from "@/utils/types";

export interface AuthHeadingProps {
  title: string;
  children: React.ReactNode;
}

export interface AuthFormProps {
  className?: string;
  children: React.ReactNode;
  onFormSubmit: (data: any) => void;
  setValidationErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>;
}

export interface AuthActionProps {
  href: string;
  linkText: string;
  children: React.ReactNode;
}

export interface AuthPinFieldProps {
  onChange: (data: any) => void;
}

export interface ProgresBarProps {
  progress: number;
}
