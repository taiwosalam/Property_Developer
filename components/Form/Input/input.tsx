"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

// Types
import type { InputProps } from "./types";

// Images
import EyeHide from "@/public/icons/eye-hide.svg";
import EyeShow from "@/public/icons/eye-show.svg";

// Imports
import clsx from "clsx";
import Label from "../Label/label";
import { checkValidatonError } from "@/utils/validation";
import Picture from "@/components/Picture/picture";

const Input: React.FC<InputProps> = ({
  id,
  label,
  style,
  value,
  leftIcon,
  required,
  className,
  placeholder,
  initialValue,
  type = "text",
  validationErrors = {},
  onChange,
  inputClassName,
}) => {
  // State to control password visibility
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  // State to store validation error message
  const [validationError, setValidationError] = useState<string | null>(null);

  // Reference to the input element
  const inputRef = useRef<HTMLInputElement>(null);

  // Toggle the visibility of the password field
  const handleInputTypeChange = () => {
    setIsPasswordVisible((prev) => !prev);
    if (inputRef.current) {
      inputRef.current.type = isPasswordVisible ? "password" : "text";
    }
  };

  // Set the input's "value" to an "initial value" when component mounts or when initialValue changes
  useEffect(() => {
    if (initialValue !== undefined && onChange != undefined) {
      onChange(initialValue);
    }
  }, [initialValue, onChange]);

  // Check and set validation error for this input when validationErrors or id changes
  useEffect(() => {
    setValidationError(
      checkValidatonError({ errors: validationErrors, key: id })
    );
  }, [validationErrors, id]);

  return (
    <div className={clsx("custom-flex-col gap-2", className)}>
      {/* Render the label if provided */}
      {label && (
        <Label id={id} required={required}>
          {label}
        </Label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3">
            <Picture src={leftIcon} alt="icon" size={24} />
          </div>
        )}
        <input
          id={id}
          name={id}
          value={value}
          ref={inputRef}
          required={required}
          placeholder={placeholder}
          // Reset validation error when the user interacts with the input
          onInput={() => setValidationError(null)}
          // Call onChange prop if provided when input value changes
          onChange={({ target }) => onChange && onChange(target.value)}
          // Conditionally change the input type based on password visibility state
          type={type === "password" && isPasswordVisible ? "text" : type}
          // Input styles
          className={clsx(
            "p-3 text-xs md:text-sm font-normal rounded-[4px] w-full custom-primary-outline border border-solid border-[#C1C2C366] bg-neutral-2 hover:border-[#00000099] transition-colors duration-300 ease-in-out",
            {
              "pr-11": type === "password", // Add padding-right if the input type is password (for icon)
              "pl-11": leftIcon, // Add padding-left if leftIcon is provided
            },

            inputClassName
          )}
          style={style} // Add custom border color
        />
        {/* Toggle button for showing/hiding password */}
        {type === "password" && (
          <button
            type="button"
            onClick={handleInputTypeChange}
            className="absolute p-1 bg-neutral-2 right-3"
            aria-label="Toggle password visibility"
          >
            <Image
              src={isPasswordVisible ? EyeHide : EyeShow}
              alt="Toggle visibility"
              height={21}
            />
          </button>
        )}
      </div>
      {/* Render validation error message if present */}
      {validationError && (
        <p className="text-sm text-red-500 font-medium">{validationError}</p>
      )}
    </div>
  );
};

export default Input;
