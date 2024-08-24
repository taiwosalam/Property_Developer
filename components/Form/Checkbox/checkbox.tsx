import React from "react";
import Image from "next/image";

// Types
import type { CheckboxProps } from "./types";

// Images
import CheckboxDefault from "@/public/icons/checkbox-default.svg";

const Checkbox: React.FC<CheckboxProps> = ({ children }) => {
  // NOTE: Manage checkbox state when chack stte image is available

  return (
    <button className="flex items-center gap-2">
      <Image
        src={CheckboxDefault}
        alt="checkbox"
        width={24}
        height={24}
        className="w-6 h-6"
      />
      <p className="text-text-secondary text-base font-medium capitalize">
        {children}
      </p>
    </button>
  );
};

export default Checkbox;
