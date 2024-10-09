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

interface PasswordResetResponse {
  success: boolean;
  data?: any; // Replace `any` with the specific type you expect
  error?: {
    errors?: { [key: string]: string[] }; // Expecting errors to have a specific format
  };
}

interface resetResponse {
  success: boolean;
  data?: { message: string }; // Expecting a success message on successful reset
  error?: {
    errors?: { [key: string]: string[] };
  };
}

export const requestPasswordReset = async (
  email: string
): Promise<PasswordResetResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!baseUrl) {
    return {
      success: false,
      error: { errors: { email: ["Base URL is not defined."] } },
    };
  }

  try {
    const response = await fetch(`${baseUrl}/requestPasswordReset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    // Check for HTTP response status
    if (!response.ok) {
      const errorResponse = await response.json();
      return {
        success: false,
        error: errorResponse, // Directly return the error structure
      };
    }

    const data = await response.json();

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: { errors: { email: ["An unknown error occurred."] } },
    };
  }
};

export const resetPassword = async (
  email: string,
  password: string
): Promise<resetResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!baseUrl) {
    return {
      success: false,
      error: { errors: { email: ["Base URL is not defined."] } },
    };
  }

  try {
    const response = await fetch(`${baseUrl}/resetPassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    // Check for HTTP response status
    if (!response.ok) {
      const errorResponse = await response.json();
      return {
        success: false,
        error: errorResponse, // Directly return the error structure
      };
    }

    const data = await response.json();

    return { success: true, data: { message: data.message } };
  } catch (error) {
    return {
      success: false,
      error: { errors: { email: ["An unknown error occurred."] } },
    };
  }
};
