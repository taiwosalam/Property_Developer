import React, { useState } from "react";

// Types
import type { FlowComponentProps } from "./types";
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

const SignUp: React.FC<FlowComponentProps> = ({ changeStep }) => {
  // State for managing error messages
  const [errorMsgs, setErrorMsgs] = useState<ValidationErrors>({});

  // Function to handle form submission
  const handleSignUp = (data: any) => {
    console.log(data);
    // NOTE: This is the part where you send the data to the backend and handle any necessary logic.
    changeStep("next"); // Change the form step to the next step in the flow
  };

  return (
    <AuthForm
      onFormSubmit={handleSignUp} // Callback function to handle form submission
      setValidationErrors={setErrorMsgs} // Function to set validation error messages
      className="custom-flex-col gap-10" // Additional class names for styling
    >
      <AuthHeading title="Create Your Account">
        Please provide the following information to set up your account.
      </AuthHeading>
      <div className="custom-flex-col gap-6">
        <Input
          id="email" // Input field ID, used for form handling and accessibility
          type="email" // Specifies that the input is for email addresses
          label="email" // Label text for the input field
          placeholder="Email Address" // Placeholder text for the input field
          validationErrors={errorMsgs} // Passes validation errors to the input component
        />
        <p className="text-text-label text-base font-normal">
          Passwords must contain an UPPERCASE letter, a lowercase letter, a
          number, and a special character.
        </p>
        <div className="custom-flex-col gap-4">
          <AuthNewPassword validationErrors={errorMsgs} />
          {/* Component to handle password input and strength validation */}
          <Input
            id="confirm-password" // Input field ID
            type="password" // Specifies that the input is for password
            label="confirm password" // Label text for the input field
            placeholder="Write here" // Placeholder text for the input field
            validationErrors={errorMsgs} // Passes validation errors to the input component
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        {/* Link for users who already have an account */}
        <AuthAction href="/auth/sign-in" linkText="sign in">
          Got an account?
        </AuthAction>
        {/* Button to submit the form */}
        <Button type="submit">continue</Button>{" "}
      </div>
    </AuthForm>
  );
};

export default SignUp;
