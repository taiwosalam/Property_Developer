"use client";

import React, { useState } from "react";
import Link from "next/link";

// Imports
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import Checkbox from "@/components/Form/Checkbox/checkbox";
import {
  AuthAction,
  AuthForm,
  AuthHeading,
} from "@/components/Auth/auth-components";
import { ValidationErrors } from "@/utils/types";

const SignIn = () => {
  // State for managing error messages
  const [errorMsgs, setErrorMsgs] = useState<ValidationErrors>({});

  const handleSignIn = (data: any) => {
    console.log(data);
    // NOTE: This is the part where you send the data to the backend and all that shit
  };

  return (
    <AuthForm
      onFormSubmit={handleSignIn}
      setValidationErrors={setErrorMsgs}
      className="custom-flex-col gap-10"
    >
      <AuthHeading title="welcome!">
        Enter your registered email and password to log in to your account.
      </AuthHeading>
      <div className="custom-flex-col gap-6">
        <Input
          id="email"
          type="email"
          label="email"
          placeholder="Email address"
          validationErrors={errorMsgs}
        />
        <div className="custom-flex-col gap-4">
          <Input
            id="password"
            type="password"
            label="password"
            placeholder="Write here"
            validationErrors={errorMsgs}
          />
          <div className="flex items-center justify-between">
            <Checkbox>remember me</Checkbox>
            <Link
              href={"/auth/forgot-password"}
              className="text-brand-9 text-sm font-medium"
            >
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <AuthAction href="/auth/sign-up" linkText="sign up">
          No account yet?
        </AuthAction>
        <Button type="submit">sign in</Button>
      </div>
    </AuthForm>
  );
};

export default SignIn;
