"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// Types
import type { CheckboxProps } from "./types";

// Images
import CheckboxDefault from "@/public/icons/checkbox-default.svg";
import CheckboxChecked from "@/public/icons/checkbox-checked.svg"; // Add the checked state image

const Checkbox: React.FC<CheckboxProps> = ({
  children,
  checked = false,
  onChange,
  sm,
}) => {
  const [internalChecked, setInternalChecked] = useState(checked);

  const handleCheckboxClick = () => {
    if (onChange) {
      onChange(!internalChecked);
    } else {
      setInternalChecked(!internalChecked);
    }
  };

  useEffect(() => {
    setInternalChecked(checked);
  }, [checked]);

  return (
    <button
      className="flex items-center gap-2"
      onClick={handleCheckboxClick}
      type="button"
    >
      <Image
        src={internalChecked ? CheckboxChecked : CheckboxDefault}
        alt="checkbox"
        width={sm ? 18 : 24}
        height={sm ? 18 : 24}
        className={sm ? "w-[18px] h-[18px]" : "w-6 h-6"}
      />
      {children && (
        <p
          className={`text-text-secondary dark:text-darkText-1 font-medium capitalize ${
            sm ? "text-sm" : "text-base"
          }`}
        >
          {children}
        </p>
      )}
    </button>
  );
};

export default Checkbox;
