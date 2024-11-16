// Types
import type { PasswordConditionsProps, PasswordStrengthProps } from "./types";

// Define password conditions with associated text descriptions and regex patterns.
export const password_conditions: PasswordConditionsProps = {
  minLength: {
    text: "8 characters",
    condition: /.{8,}/,
  },
  uppercase: {
    text: "one uppercase letter",
    condition: /[A-Z]/,
  },
  lowercase: {
    text: "one lowercase letter",
    condition: /[a-z]/,
  },
  number: {
    text: "one number",
    condition: /\d/,
  },
  specialCharacter: {
    text: "one special character",
    condition: /[@$!%*?&]/,
  },
};

// Define password strength levels with corresponding labels and colors.
export const password_strength: PasswordStrengthProps = {
  1: {
    label: "weak",
    color: "#FF3E00",
  },
  40: {
    label: "fair",
    color: "#FFA500",
  },
  60: {
    label: "medium",
    color: "#E98305",
  },
  80: {
    label: "strong",
    color: "#4CAF50",
  },
  100: {
    label: "perfect",
    color: "#01ba4c",
  },
};
