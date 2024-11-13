"use client";

import { useState } from "react";

// Types
import type { ValidationErrors } from "@/utils/types";

// Imports
import {
  AuthForm,
  AuthAction,
  AuthHeading,
  AuthNewPassword,
} from "@/components/Auth/auth-components";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import { resetPassword } from "../data";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const CreateNewPassword = () => {
  const router = useRouter();
  // State for managing error messages
  const [errorMsgs, setErrorMsgs] = useState<ValidationErrors>({});

  const handleCreatePassword = async (data: FormData) => {
    const password = data.get("new-password") as string;

    try {
      const res = await resetPassword("email", password);

      if (res.success) {
        console.log(res.data?.message, "response message");
        toast.success(res.data?.message || "Password reset successfully.");
        router.push("/auth/sign-in");
      } else {
        // Extract error message and provide feedback to the user
        const errorMessage =
          res.error?.errors?.email?.[0] ||
          "An error occurred. Please try again.";
        toast.error(errorMessage);
        console.error(res.error, "Error details");
      }
    } catch (error) {
      // Handle unexpected errors
      toast.error("An unexpected error occurred. Please try again.");
      console.error("Unexpected error:", error);
    }
  };

  return (
    <AuthForm
      onFormSubmit={handleCreatePassword}
      setValidationErrors={setErrorMsgs}
      className="custom-flex-col gap-10"
    >
      {/* Heading explaining the password requirements */}
      <AuthHeading title="Create New Password">
        Passwords must contain UPPERCASE letter, an alphabet, a number, and a
        special character
      </AuthHeading>

      {/* Container for password input fields */}
      <div className="custom-flex-col gap-6">
        {/* Component to handle password input and strength validation */}
        <AuthNewPassword validationErrors={errorMsgs} />
        <Input
          id="confirm-password"
          type="password"
          label="confirm password"
          placeholder="Write here"
          validationErrors={errorMsgs}
        />
      </div>

      <div className="flex gap-2 items-center justify-between">
        {/* Link to Terms & Conditions */}
        {/* <AuthAction href="" linkText="Terms & Condition">
          By creating an account, you are consenting to our
        </AuthAction> */}
        {/* Submit button to proceed */}
        <Button type="submit">proceed</Button>
      </div>
    </AuthForm>
  );
};

export default CreateNewPassword;
