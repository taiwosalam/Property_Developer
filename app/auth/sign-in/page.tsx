import React from "react";
import Link from "next/link";

// Imports
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import Checkbox from "@/components/Form/Checkbox/checkbox";
import { AuthForm, AuthHeading } from "@/components/Auth/auth-components";

const SignIn = () => {
  return (
    <AuthForm className="custom-flex-col gap-10">
      <AuthHeading title="welcome!">
        Enter your registered email and password to log in to your account.
      </AuthHeading>
      <div className="custom-flex-col gap-6">
        <Input
          id="email"
          type="email"
          label="email"
          placeholder="Email address"
        />
        <div className="custom-flex-col gap-4">
          <Input
            id="password"
            type="password"
            label="password"
            placeholder="Write here"
          />
          <div className="flex items-center justify-between">
            <Checkbox>remember me</Checkbox>
            <Link href={""} className="text-brand-9 text-sm font-medium">
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-text-black text-base font-normal">
          No account yet?{" "}
          <Link href={""} className="text-brand-9 font-medium">
            Sign Up
          </Link>
        </p>
        <Button type="submit">sign in</Button>
      </div>
    </AuthForm>
  );
};

export default SignIn;
