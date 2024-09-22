"use client";

import React from "react";
import { useRouter } from "next/navigation";

// Types
import type { BackButtonProps } from "./types";

// Images
import ChevronLeft from "@/public/icons/chevron-left.svg";

// Imports
import Picture from "../Picture/picture";

const BackButton: React.FC<BackButtonProps> = ({ children }) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex items-center gap-2">
      <button onClick={handleBack}>
        <Picture src={ChevronLeft} alt="back" size={32} />
      </button>
      <h1 className="text-2xl font-bold text-black">{children}</h1>
    </div>
  );
};

export default BackButton;
