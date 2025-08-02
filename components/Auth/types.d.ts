// Types
import type { Color } from "@/types/global";
import type { ValidationErrors, ValidationOutput } from "@/utils/types";

export interface AuthHeadingProps {
  title: string;
  children: React.ReactNode;
  logo?: string;
}

export interface AuthFormProps {
  className?: string;
  children: React.ReactNode;
  id?: string;
  autoComplete?: "on" | "off";
  onFormSubmit: (data: any, e?: React.FormEvent<HTMLFormElement>) => void;
  returnType?: "form-data" | "string";
  setValidationErrors?:
    | React.Dispatch<React.SetStateAction<ValidationErrors>>
    | ((errors: ValidationErrors) => void);
  skipValidation?: boolean;
}

export interface AuthActionProps {
  href: string;
  linkText: string;
  children: React.ReactNode;
}

export interface AuthPinFieldProps {
  onChange: (data: any) => void;
  length?: number;
  resetTrigger?: string;
  className?: string
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
  label?: string;
  className?: string;
}
