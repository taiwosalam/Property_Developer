"use client";

import { useState } from "react";
// Images
import CheckboxDefault from "@/public/icons/checkbox-default.svg";
import CheckboxChecked from "@/public/icons/checkbox-checked.svg";

// Imports
import Picture from "../../Picture/picture";
import { DocumentCheckboxProps } from "./types";
import { cn } from "@/lib/utils";

const DocumentCheckbox: React.FC<DocumentCheckboxProps> = ({
  title,
  state,
  darkText,
  children,
  checked,
  alignCheckboxCenter,
  className,
  onClick,
  onChange,
  name,
}) => {
  // Internal state for when the component is uncontrolled
  const [internalIsChecked, setInternalIsChecked] = useState(checked || false);

  // Determine whether to use controlled or internal state
  const isChecked = state ? state.isChecked : internalIsChecked;
  const setIsChecked = state ? state.setIsChecked : setInternalIsChecked;

  const handleClick = () => {
    // This works fine for both controlled and uncontrolled scenarios
    setIsChecked((prev) => {
      const newValue = !prev;
      name && onChange?.(name, newValue); // Call onChange with name and new value
      return newValue;
    });
    if (onClick) {
      onClick();
    }

    const newValue = !isChecked;
    if (name) {
      onChange?.(name, newValue); // Pass name and checked status to parent
    }
    setIsChecked(newValue);
  };
  return (
    <button
      className={cn("flex gap-3 text-start w-full", className)}
      onClick={handleClick}
      type="button"
    >
      <div
        className={cn("flex h-full", {
          "items-center": alignCheckboxCenter,
          "items-start": !alignCheckboxCenter,
        })}
      >
        <Picture
          src={isChecked ? CheckboxChecked : CheckboxDefault}
          alt="checkbox"
          size={18}
        />
      </div>
      <div className="custom-flex-col gap-[2px]">
        {title && (
          <p className="text-text-quaternary dark:text-darkText-1 text-base font-medium capitalize">
            {title}
          </p>
        )}
        {children && (
          <p
            className={cn("text-sm font-normal", {
              "text-text-secondary dark:text-darkText-1": darkText,
              "text-text-disabled dark:text-darkText-disabled": !darkText,
            })}
          >
            {children}
          </p>
        )}
      </div>
    </button>
  );
};

export default DocumentCheckbox;
