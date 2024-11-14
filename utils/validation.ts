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
  password_confirmation: z
    .string()
    .min(1, { message: "Password Confirmation cannot be empty" }),
  password: z
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
  "new-pin": z
    .string()
    .length(4, { message: "PIN must be exactly 4 characters long" }),
  "confirm-pin": z
    .string()
    .length(4, { message: "PIN must be exactly 4 characters long" }),
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

  // Handle Zod validation errors for known fields
  if (!result.success) {
    Object.entries(result.error.formErrors.fieldErrors).forEach(
      ([key, errors]) => {
        output.invalidKeys[key] = errors.join(", ") + ".";
      }
    );
  }

  // Identify unknown keys and check for emptiness
  Object.keys(data).forEach((key) => {
    if (!(key in validation_schemas)) {
      output.unknownKeys.push(key); // Add to unknownKeys
      // if (!data[key]) {
      //   output.invalidKeys[key] = "This field cannot be empty."; // Check if empty
      // }
    }
  });

  // Check exceptions only if there are no existing errors
  //----------------------------------
  if (!output.invalidKeys["password_confirmation"]) {
    if (
      data["password_confirmation"] !== undefined &&
      data["password"] !== undefined
    ) {
      if (data["password_confirmation"] !== data["password"]) {
        output.invalidKeys["password_confirmation"] = "Passwords do not match.";
      }
    }
  }

  if (!output.invalidKeys["confirm-pin"]) {
    if (
      data["new-pin"] !== undefined &&
      data["confirm-pin"] !== undefined &&
      data["new-pin"] !== data["confirm-pin"]
    ) {
      output.invalidKeys["confirm-pin"] = "PINs do not match.";
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
