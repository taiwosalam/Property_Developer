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
    <div className="flex">
      <button className="flex gap-3 text-start" onClick={handleClick}>
        <div className="flex items-start">
          <Picture
            src={isChecked ? CheckboxChecked : CheckboxDefault}
            alt="checkbox"
            size={18}
          />
        </div>
        <div className="custom-flex-col gap-[2px]">
          {title && (
            <p className="text-text-quaternary text-base font-medium capitalize">
              {title}
            </p>
          )}
          <p
            className={clsx("text-sm font-normal", {
              "text-text-secondary": darkText,
              "text-text-disabled": !darkText,
            })}
          >
            {children}
          </p>
        </div>
      </button>
    </div>
  );
};

export default DocumentCheckbox;
