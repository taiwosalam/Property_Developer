"use client";

import { useState } from "react";

// Types
import type { ValidationErrors } from "@/utils/types";

// Imports
import {
  AuthForm,
  // AuthAction,
  AuthHeading,
  AuthNewPassword,
} from "@/components/Auth/auth-components";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import { useRouter } from "next/navigation";
import { updatePassword } from "@/app/(onboarding)/auth/data";

const CreateNewPassword = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // State for managing error messages
  const [errorMsgs, setErrorMsgs] = useState<ValidationErrors>({});

  const handleCreateNewPassword = async (formData: FormData) => {
    setIsLoading(true);
    const success = await updatePassword(formData);
    if (success) router.push("/auth/sign-in");
    setIsLoading(false);
  };

  return (
    <AuthForm
      returnType="form-data"
      onFormSubmit={handleCreateNewPassword}
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
          id="password_confirmation"
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
        <Button type="submit" className="ml-auto" disabled={isLoading}>
          {isLoading ? "Please wait..." : "proceed"}
        </Button>
      </div>
    </AuthForm>
  );
};

export default CreateNewPassword;
