// Types
import type { Color } from "@/types/global";
import type { ValidationErrors, ValidationOutput } from "@/utils/types";

export interface AuthHeadingProps {
  title: string;
  children: React.ReactNode;
}

export interface AuthFormProps {
  className?: string;
  children: React.ReactNode;
  onFormSubmit: (data: any) => void;
  returnType?: "form-data" | "string";
  setValidationErrors:
    | React.Dispatch<React.SetStateAction<ValidationErrors>>
    | ((errors: ValidationErrors) => void);
}

export interface AuthActionProps {
  href: string;
  linkText: string;
  children: React.ReactNode;
}

export interface AuthPinFieldProps {
  onChange: (data: any) => void;
}

export type PasswordConditionsProps = Record<
  string,
  { text: string; condition: RegExp }
>;

export type PasswordStrengthProps = Record<
  number,
  { label: string; color: Color }
>;

export interface AuthNewPasswordProps {
  setValue?: React.Dispatch<React.SetStateAction<string>>;
  validationErrors?: ValidationErrors;
}
