"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import Checkbox from "@/components/Form/Checkbox/checkbox";
import {
  AuthAction,
  AuthForm,
  AuthHeading,
} from "@/components/Auth/auth-components";

import { getDashboardPage, login } from "@/app/(onboarding)/auth/data";
import { useAuthStore } from "@/store/authStore";
import Cookies from "js-cookie";

const SignIn = () => {
  const router = useRouter();
  // const role = useAuthStore((state) => state.role);
  const role = Cookies.get("role") || "";


  console.log("dashboardPage", getDashboardPage);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: Record<string, any>) => { 
    setIsLoading(true);
    const a = await login(formData);
    if (a === "redirect to verify email") {
      router.push("/auth/sign-up");
    } else if (a === "redirect to dashboard") {
      const interval = setInterval(() => {
        const currentRole = useAuthStore.getState().role;
        if (currentRole) {
          clearInterval(interval);
          router.push(getDashboardPage(currentRole));
        }
      }, 50);
    } else if (a === "redirect to setup") {
      router.push("/setup");
    }
    setIsLoading(false);
  };

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
          id="username"
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
