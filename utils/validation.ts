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
  email: z.string().email({ message: "Please enter a valid email address" }),
  "confirm-password": z
    .string()
    .min(1, { message: "Confirm password cannot be empty" }),
  password: z.string().min(1, { message: "Password cannot be empty" }),
  "new-password": z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/\d/, { message: "Password must contain at least one number" })
    .regex(/[@$!%*?&]/, {
      message: "Password must contain at least one special character",
    }),
  code: z
    .string()
    .length(6, { message: "OTP must be exactly 6 characters long" }),
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
        output.invalidKeys[key] = errors.join(", ") + ".";
        // output.invalidKeys[key] = errors[0] + ".";
      }
    );
  }

  // Identify unknown keys that aren't defined in validationSchemas
  Object.keys(data).forEach((key) => {
    if (!(key in validation_schemas)) {
      output.unknownKeys.push(key);
    }
  });

  // Check exceptions only if there are no existing errors
  //----------------------------------
  // Check exception if confirm-password doesn't already have a message
  if (!output.invalidKeys["confirm-password"]) {
    // Ensure both "confirm-password" and "new-password" are present in the data
    if (
      data["confirm-password"] !== undefined &&
      data["new-password"] !== undefined
    ) {
      if (data["confirm-password"] !== data["new-password"]) {
        output.invalidKeys["confirm-password"] = "Passwords do not match.";
      }
    }
  }
  //----------------------------------

  return output;
};

export const checkValidatonError = ({
  errors,
  key,
}: CheckValidatonErrorProps) => {
  return key in errors ? errors[key] : null;
};
