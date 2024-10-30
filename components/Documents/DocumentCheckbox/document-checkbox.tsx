"use client";

import React, { useState } from "react";

// Images
import CheckboxDefault from "@/public/icons/checkbox-default.svg";
import CheckboxChecked from "@/public/icons/checkbox-checked.svg";

// Imports
import Picture from "../../Picture/picture";
import { DocumentCheckboxProps } from "./types";
import clsx from "clsx";

const DocumentCheckbox: React.FC<DocumentCheckboxProps> = ({
  title,
  state,
  darkText,
  children,
  checked,
  alignCheckboxCenter,
}) => {
  // Internal state for when the component is uncontrolled
  const [internalIsChecked, setInternalIsChecked] = useState(checked || false);

  // Determine whether to use controlled or internal state
  const isChecked = state ? state.isChecked : internalIsChecked;
  const setIsChecked = state ? state.setIsChecked : setInternalIsChecked;

  const handleClick = () => {
    setIsChecked((prev) => !prev);
  };

  return (
    <div className="flex w-full">
      <button
        className="flex gap-3 text-start"
        onClick={handleClick}
        type="button"
      >
        <div
          className={clsx("flex h-full", {
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
              className={clsx("text-sm font-normal", {
                "text-text-secondary dark:text-darkText-1": darkText,
                "text-text-disabled dark:text-darkText-disabled": !darkText,
              })}
            >
              {children}
            </p>
          )}
        </div>
      </button>
    </div>
  );
};

export default DocumentCheckbox;
