// Capitalize
export interface CapitalizeProps {
  input: string;
  mode: "word" | "sentence";
}

// Validation
export type ValidateDataProps = Record<string, string>;

export type ValidationErrors = Record<string, string>;

export interface ValidationOutput {
  invalidKeys: ValidationErrors;
  unknownKeys: string[];
}

export interface CheckValidatonErrorProps {
  errors: ValidationErrors;
  key: string;
}

// Object length
export type ObjectLengthProps = Record<any, any>;
