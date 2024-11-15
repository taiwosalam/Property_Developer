"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// Imports
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import Checkbox from "@/components/Form/Checkbox/checkbox";
import {
  AuthAction,
  AuthForm,
  AuthHeading,
} from "@/components/Auth/auth-components";
import { login } from "@/app/(onboarding)/auth/data";
import { useAuthStore } from "@/store/authStore";

const SignIn = () => {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: Record<string, any>) => {
    setIsLoading(true);
    const a = await login(formData);
    if (a === "redirect to verify email") {
      router.push(`/auth/sign-up?email=${formData.email}`);
    } else if (a === "redirect to dashboard") {
      router.push("/dashboard");
    } else if (a === "redirect to setup") {
      router.push("/setup");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (token) {
      router.replace("/");
    }
  }, [token, router]);

  return (
    <AuthForm
      onFormSubmit={handleSubmit}
      skipValidation
      className="custom-flex-col gap-10 pt-6"
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
          requiredNoStar
        />
        <div className="custom-flex-col gap-4">
          <Input
            id="password"
            type="password"
            label="password"
            placeholder="Enter your password"
            requiredNoStar
            minLength={8}
          />
          <div className="flex items-center justify-between">
            <Checkbox
              inputName="remember-me"
              defaultChecked
              // checked={rememberMe}
              // onChange={() => setRememberMe(!rememberMe)}
            >
              remember me
            </Checkbox>
            <Link
              href="/auth/forgot-password"
              className="custom-primary-color text-sm font-medium"
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
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "signing in..." : "sign in"}
        </Button>
      </div>
    </AuthForm>
  );
};

export default SignIn;
