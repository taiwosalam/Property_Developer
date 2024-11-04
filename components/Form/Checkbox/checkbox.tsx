"use client";

import { useState } from "react";
import Image from "next/image";

// Types
import type { CheckboxProps } from "./types";

// Images
import CheckboxDefault from "@/public/icons/checkbox-default.svg";
import CheckboxChecked from "@/public/icons/checkbox-checked.svg"; // Add the checked state image

const Checkbox: React.FC<CheckboxProps> = ({
  children,
  checked,
  onChange,
  sm,
}) => {
  const [internalIsChecked, setInternalIsChecked] = useState(checked || false);

  const isChecked = checked ? checked : internalIsChecked;
  const setIsChecked = onChange ? onChange : setInternalIsChecked;

  // Handle the click event to toggle the checkbox state
  const handleCheckboxClick = () => {
    setIsChecked(!isChecked);
  };

  return (
    <button
      className="flex items-center gap-2"
      onClick={handleCheckboxClick}
      type="button"
    >
      <Image
        src={isChecked ? CheckboxChecked : CheckboxDefault}
        alt="checkbox"
        width={sm ? 18 : 24}
        height={sm ? 18 : 24}
        className={sm ? "w-[18px] h-[18px]" : "w-6 h-6"}
      />
      <p
        className={`text-text-secondary dark:text-darkText-1 font-medium capitalize ${
          sm ? "text-sm" : "text-base"
        }`}
      >
        {children}
      </p>
    </button>
  );
};

export default Checkbox;
