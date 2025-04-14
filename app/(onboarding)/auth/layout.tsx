"use client";

import React from "react";
import Image from "next/image";

// Types
import type { AuthLayoutProps } from "./types";

// Images
import Lines from "@/public/auth/lines.svg";

// Imports
import AuthSlider from "@/components/Auth/AuthSlider/auth-slider";
import { auth_slider_content } from "./data";
import { usePathname } from "next/navigation";

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const isUserSignInPage = pathname === "/auth/user/sign-in";
  return (
    <div className="relative w-full h-screen overflow-hidden bg-brand-1">
      <div className="absolute inset-0 opacity-50">
        <Image
          src={Lines}
          alt="background"
          fill
          sizes="100vw"
          className="object-cover opacity-30"
        />
      </div>
      <div className="relative h-full flex gap-10 p-[20px] sm:p-[60px]">
        <div
          className={
            isUserSignInPage
              ? "flex-1 flex items-center justify-center"
              : "flex-1 flex items-center justify-start"
          }
        >
          <div className="w-full max-w-[580px] pb-6 px-10 rounded-2xl bg-white dark:bg-darkText-primary max-h-full overflow-x-hidden overflow-y-auto no-scrollbar">
            {children}
          </div>
        </div>
        {!isUserSignInPage && (
          <div className="flex-1 hidden lg:flex items-center justify-center">
            <div className="flex items-start h-[55%]">
              <AuthSlider content={auth_slider_content} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthLayout;
