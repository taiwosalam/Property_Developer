"use client";
import clsx from "clsx";
import { useState, useEffect } from "react";
// Types
import type { CheckboxProps } from "./types";
import { CheckboxDefault, CheckboxChecked } from "@/public/icons/icons";

const Checkbox: React.FC<CheckboxProps> = ({
  children,
  checked,
  onChange,
  sm,
  className,
  hoverContent,
}) => {
  const [internalChecked, setInternalChecked] = useState(checked ?? false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCheckboxClick = () => {
    if (onChange) {
      onChange(!internalChecked);
    } else if (checked === undefined) {
      setInternalChecked(!internalChecked);
    }
  };

  useEffect(() => {
    if (checked !== undefined) {
      setInternalChecked(checked);
    }
  }, [checked]);

  return (
    <button
      className={clsx("flex items-center gap-2 relative", className)}
      onClick={handleCheckboxClick}
      type="button"
      {...(hoverContent && {
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
      })}
    >
      {internalChecked ? (
        <CheckboxChecked size={sm ? 18 : 24} />
      ) : (
        <CheckboxDefault size={sm ? 18 : 24} />
      )}
      {children && (
        <p
          className={`text-text-secondary dark:text-darkText-1 font-medium capitalize ${
            sm ? "text-sm" : "text-base"
          }`}
        >
          {children}
        </p>
      )}
      {isHovered && hoverContent && hoverContent}
    </button>
  );
};

export default Checkbox;
