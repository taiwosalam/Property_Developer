"use client";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
// Types
import type { CheckboxProps } from "./types";
import {
  CheckboxDefault,
  CheckboxChecked,
  RadioUncheckedIcon,
  RadioCheckedIcon,
} from "@/public/icons/icons";

const Checkbox: React.FC<CheckboxProps> = ({
  children,
  checked,
  onChange,
  sm,
  className,
  hoverContent,
  radio,
  defaultChecked = false,
  disabled, // new optional prop
  name,
  id,
  value,
}) => {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const [isHovered, setIsHovered] = useState(false);

  const handleCheckboxClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return; // Prevent clicking when disabled
    const newCheckedState = checked !== undefined ? !checked : !internalChecked;
    if (onChange) {
      onChange(newCheckedState);
    }
    if (checked === undefined) {
      setInternalChecked(newCheckedState);
    }
  };

  const isChecked = checked !== undefined ? checked : internalChecked;

  useEffect(() => {
    if (checked !== undefined) {
      setInternalChecked(checked);
    }
  }, [checked]);

  return (
    <button
      className={cn(
        "flex items-center gap-2 relative",
        className,
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      )}
      onClick={handleCheckboxClick}
      type="button"
      disabled={disabled}
      {...(hoverContent && {
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
      })}
    >
      <input type="hidden" checked={isChecked} name={name} id={id} />
      {isChecked ? (
        radio ? (
          <RadioCheckedIcon />
        ) : (
          <CheckboxChecked size={sm ? 18 : 24} />
        )
      ) : radio ? (
        <RadioUncheckedIcon />
      ) : (
        <CheckboxDefault size={sm ? 18 : 24} />
      )}
      {children && (
        <p
          className={`text-text-secondary dark:text-darkText-1 text-xs md:text-sm capitalize ${
            sm ? "text-sm font-normal" : "text-base font-medium"
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
