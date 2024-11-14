import { useState } from "react";

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
import { signup } from "@/app/(onboarding)/auth/data";

const SignUp: React.FC<FlowComponentProps> = ({ changeStep }) => {
  // State for managing error messages
  const [errorMsgs, setErrorMsgs] = useState<ValidationErrors>({});

  // Function to handle form submission
  const handleSignUp = async (data: FormData) => {
    // Call the signup function from the API service
    const status = await signup(data);
    // console.log(status, "signup status");
    if (status) {
      changeStep("next");
    }
  };

  return (
    <AuthForm
      onFormSubmit={handleSignUp}
      setValidationErrors={setErrorMsgs}
      className="custom-flex-col gap-10"
    >
      <AuthHeading title="Create Your Account">
        Please provide the following information to set up your account.
      </AuthHeading>
      <div className="custom-flex-col gap-6">
        <Input
          id="email"
          type="email"
          label="email"
          placeholder="Email Address"
          validationErrors={errorMsgs}
        />
        <p className="text-text-label text-base font-normal">
          Passwords must contain an UPPERCASE letter, lowercase letter, number,
          and a special character.
        </p>
        <div className="custom-flex-col gap-4">
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
      </div>
      <div className="flex items-center justify-between">
        {/* Link for users who already have an account */}
        <AuthAction href="/auth/sign-in" linkText="sign in">
          Got an account?
        </AuthAction>
        {/* Button to submit the form */}
        <Button type="submit">continue</Button>
      </div>
    </AuthForm>
  );
};

export default SignUp;
