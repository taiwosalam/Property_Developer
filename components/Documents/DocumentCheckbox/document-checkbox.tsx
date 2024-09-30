"use client";

import React, { useState } from "react";

// Images
import CheckboxDefault from "@/public/icons/checkbox-default.svg";
import CheckboxChecked from "@/public/icons/checkbox-checked.svg";

// Imports
import Picture from "../../Picture/picture";
import { DocumentCheckboxProps } from "./types";

const DocumentCheckbox: React.FC<DocumentCheckboxProps> = ({
  title,
  state,
  children,
}) => {
  // Internal state for when the component is uncontrolled
  const [internalIsChecked, setInternalIsChecked] = useState(false);

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
          <p className="text-text-quaternary text-base font-medium capitalize">
            {title}
          </p>
          <p className="text-text-disabled text-sm font-normal">{children}</p>
        </div>
      </button>
    </div>
  );
};

export default DocumentCheckbox;
