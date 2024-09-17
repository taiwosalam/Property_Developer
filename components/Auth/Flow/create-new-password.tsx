import React, { useState } from "react";

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

const CreateNewPassword = () => {
  // State for managing error messages
  const [errorMsgs, setErrorMsgs] = useState<ValidationErrors>({});

  // Handler for form submission
  const handleCreatePassword = (data: any) => {
    console.log(data);
    // NOTE: This is the part where you would send the data to the backend
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
        <AuthAction href="" linkText="Terms & Condition">
          By creating an account, you are consenting to our
        </AuthAction>
        {/* Submit button to proceed */}
        <Button type="submit">proceed</Button>
      </div>
    </AuthForm>
  );
};

export default CreateNewPassword;
