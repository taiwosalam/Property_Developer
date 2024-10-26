import React from "react";
import Image from "next/image";

// Types
import type { CheckboxProps } from "./types";

// Images
import CheckboxDefault from "@/public/icons/checkbox-default.svg";
import CheckboxChecked from "@/public/icons/checkbox-checked.svg"; // Add the checked state image

const Checkbox: React.FC<CheckboxProps> = ({ children, checked, onChange }) => {
  // Handle the click event to toggle the checkbox state
  const handleCheckboxClick = () => {
    if (onChange) {
      onChange(!checked);
    }
  };

  return (
    <button
      className="flex items-center gap-2"
      onClick={handleCheckboxClick}
      type="button"
    >
      <Image
        src={checked ? CheckboxChecked : CheckboxDefault}
        alt="checkbox"
        width={24}
        height={24}
        className="w-6 h-6"
      />
      <p className="text-text-secondary dark:text-darkText-1 text-base font-medium capitalize">
        {children}
      </p>
    </button>
  );
};

export default Checkbox;
