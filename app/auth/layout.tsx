import React from "react";
import Image from "next/image";

// Types
import type { AuthLayoutProps } from "./types";

// Images
import Lines from "@/public/auth/lines.svg";

// Imports
import AuthSlider from "@/components/Auth/AuthSlider/auth-slider";
import { auth_slider_content } from "./data";

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-brand-1">
      <div className="absolute inset-0 opacity-50">
        <Image src={Lines} alt="background" fill sizes="100vw" />
      </div>
      <div className="relative h-full flex gap-10 p-[60px]">
        <div className="flex-1 flex items-center justify-start">
          <div className="py-6 px-10 rounded-2xl bg-white max-h-full overflow-x-hidden overflow-y-auto no-scrollbar">
            {children}
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <AuthSlider content={auth_slider_content} />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
