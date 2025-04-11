// Capitalize
export interface CapitalizeProps {
  input: string;
  mode?: "word" | "sentence";
}

// Validation
export type ValidateDataProps = Record<string, any>;

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




// Define types for our fetch states
export interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Define type for all branch-dependent fetches
export interface BranchDependentData {
  inventory: FetchState<AllInventoryResponse>;
  staff: FetchState<AllLandlordsResponse>;
  accountOfficer: FetchState<AllLandlordsResponse>;
}
