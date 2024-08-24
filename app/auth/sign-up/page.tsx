"use client";

import { useState } from "react";
import Link from "next/link";

// Imports
import { ProgressBar } from "@/components/Auth/auth-progress";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import { AuthForm, AuthHeading } from "@/components/Auth/auth-components";
import OtpScreen from "@/components/Auth/otp-screen";

const SignUp = () => {
  const [progress, setProgress] = useState(50);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleSubmit = () => {
    // Validation and submission logic
    setIsFormSubmitted(true);
    setProgress(100);
  };

  return (
    <AuthForm className="custom-flex-col gap-10">
      <ProgressBar progress={progress} />
      {isFormSubmitted ? (
        <>
          <AuthHeading title="Verify Email Address">
            An OTP code has been sent to your email for verification.
          </AuthHeading>
          <OtpScreen />
        </>
      ) : (
        <>
          <AuthHeading title="Create Your Account">
            Please provide the following information to set up your account.
          </AuthHeading>
          <div className="custom-flex-col gap-6">
            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="Email address"
            />
            <div className="custom-flex-col gap-4">
              <Input
                id="password"
                type="password"
                label="Password"
                placeholder="Write here"
              />
              <Input
                id="confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder="Write here"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-text-black text-base font-normal">
              Got an account?
              <Link
                href={"/auth/sign-in"}
                className="text-brand-9 font-medium ml-1"
              >
                Sign In
              </Link>
            </p>
            <Button type="button" onClick={handleSubmit}>
              Sign Up
            </Button>
          </div>
        </>
      )}
    </AuthForm>
  );
};

export default SignUp;
