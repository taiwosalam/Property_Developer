// Types
import type {
  ValidationOutput,
  ValidateDataProps,
  CheckValidatonErrorProps,
} from "./types";

// Imports
import { z } from "zod";

// Validation schemas for each field
const validation_schemas = {
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password cannot be empty" }),
};

// Main validation function
export const validateData = (data: ValidateDataProps) => {
  const output: ValidationOutput = {
    invalidKeys: {},
    unknownKeys: [],
  };

  // Create a schema based on the keys present in the data
  const schema = z.object(validation_schemas).partial();
  const result = schema.safeParse(data);

  // Handle Zod validation errors
  if (!result.success) {
    Object.entries(result.error.formErrors.fieldErrors).forEach(
      ([key, errors]) => {
        output.invalidKeys[key] = errors.join(", ");
      }
    );
  }

  // Identify unknown keys that aren't defined in validationSchemas
  Object.keys(data).forEach((key) => {
    if (!(key in validation_schemas)) {
      output.unknownKeys.push(key);
    }
  });

  return output;
};

export const checkValidatonError = ({
  errors,
  key,
}: CheckValidatonErrorProps) => {
  return key in errors ? errors[key] : null;
};
