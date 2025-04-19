"use client";

import Picture from "@/components/Picture/picture";
import CheckboxDefault from "@/public/icons/checkbox-default.svg";
import CheckboxChecked from "@/public/icons/checkbox-checked.svg";
import { cn } from "@/lib/utils";
import { DocumentCheckboxProps } from "./types";

const ManagementCheckbox: React.FC<DocumentCheckboxProps> = ({
  title,
  darkText,
  children,
  checked,
  alignCheckboxCenter,
  className,
  onClick,
  onChange,
  name,
}) => {
  const handleChange = () => {
    // Call onClick to trigger parent state update (e.g., handleCheckboxClick)
    if (onClick) {
      onClick();
    }
    // Call onChange with name and new checked value for compatibility
    if (name && onChange) {
      onChange(name, !checked);
    }
  };

  return (
    <label
      className={cn("flex gap-3 text-start w-full cursor-pointer", className)}
    >
      <div
        className={cn("flex h-full", {
          "items-center": alignCheckboxCenter,
          "items-start": !alignCheckboxCenter,
        })}
      >
        {/* Hidden native checkbox for accessibility */}
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          className="sr-only" // Hide native checkbox visually
        />
        <Picture
          src={checked ? CheckboxChecked : CheckboxDefault}
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
    </label>
  );
};

export default ManagementCheckbox;