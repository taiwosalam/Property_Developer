"use client";

import { useState } from "react";

// Types
import type { FlowComponentProps } from "./types";
import type { ValidationErrors } from "@/utils/types";

// Imports
import {
  AuthForm,
  AuthAction,
  AuthHeading,
} from "@/components/Auth/auth-components";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import { requestPasswordReset } from "@/app/(onboarding)/auth/data";

const ForgotPassword: React.FC<FlowComponentProps> = ({ changeStep }) => {
  const [errorMsgs, setErrorMsgs] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (data: FormData) => {
    setIsLoading(true);
    const status = await requestPasswordReset(data);
    if (status) {
      changeStep("next");
    }
    setIsLoading(false);
  };

  return (
    <AuthForm
      returnType="form-data"
      onFormSubmit={handleForgotPassword}
      setValidationErrors={setErrorMsgs}
      className="custom-flex-col gap-10"
    >
      <AuthHeading title="Create New Password">
        Please provide the email address you used to set up your account.
      </AuthHeading>
      <Input
        id="email"
        type="email"
        label="email"
        placeholder="Write here"
        validationErrors={errorMsgs}
      />
      <div className="flex items-center justify-between">
        <AuthAction href="/auth/sign-in" linkText="sign in">
          Got an account?
        </AuthAction>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Please wait..." : "continue"}
        </Button>
      </div>
    </AuthForm>
  );
};

export default ForgotPassword;
