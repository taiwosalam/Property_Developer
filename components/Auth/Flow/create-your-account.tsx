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
import Text from "@/components/Form/Text/text";

const SignUp: React.FC<FlowComponentProps> = ({ changeStep }) => {
  const [requestLoading, setRequestLoading] = useState(false);
  // State for managing error messages
  const [errorMsgs, setErrorMsgs] = useState<ValidationErrors>({});

  // Function to handle form submission
  const handleSignUp = async (data: FormData) => {
    setRequestLoading(true);
    const status = await signup(data);
    if (status) {
      changeStep("next");
    }
    setRequestLoading(false);
  };

  return (
    <AuthForm
      onFormSubmit={handleSignUp}
      setValidationErrors={setErrorMsgs}
      className="custom-flex-col mid-gap"
    >
      <AuthHeading title="Create Your Account">
        Please provide the following information to set up your account.
      </AuthHeading>
      <div className="custom-flex-col mid-gap">
        <Input
          id="email"
          type="email"
          label="Company Email"
          placeholder="Use a company email for this process"
          validationErrors={errorMsgs}
        />
        <Text as="p" variant="change" size="xs_normal">
          Passwords must contain an UPPERCASE letter, lowercase letter, number,
          and a special character.
        </Text>
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
        <Button
          type="submit"
          disabled={requestLoading}
          size="base_bold"
          variant="default"
          className="py-xs px-md"
        >
          {requestLoading ? "Please wait..." : "continue"}
        </Button>
      </div>
    </AuthForm>
  );
};

export default SignUp;
