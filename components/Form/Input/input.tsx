"use client";

import { useEffect, useRef, useState } from "react";

// Types
import type { InputProps } from "./types";

import { EyeHideIcon, EyeShowIcon } from "@/public/icons/icons";

// Imports
import clsx from "clsx";
import Label from "../Label/label";
import { checkValidatonError } from "@/utils/validation";
import Picture from "@/components/Picture/picture";
import { formatCostInputValue } from "@/utils/number-formatter";

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
  defaultValue,
  type = "text",
  validationErrors = {},
  labelclassName,
  onChange,
  inputClassName,
  CURRENCY_SYMBOL,
  readOnly,
  disabled,
  min,
  max,
  maxLength,
  requiredNoStar,
  formatNumber,
  endWith,
  isPinField,
  minLength,
  name,
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
    <div
      className={clsx(
        "custom-flex-col gap-2",
        disabled && "opacity-60",
        className
      )}
    >
      {/* Render the label if provided */}
      {label && (
        <Label id={id} required={required} labelclassName={labelclassName}>
          {label}
        </Label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3">
            <Picture src={leftIcon} alt="icon" size={24} />
          </div>
        )}
        {CURRENCY_SYMBOL && (
          <p className="absolute left-3 text-xs md:text-sm font-medium opacity-50">
            {CURRENCY_SYMBOL}
          </p>
        )}

        <input
          id={id}
          name={name ? name : id}
          value={value}
          ref={inputRef}
          required={required || requiredNoStar}
          readOnly={readOnly}
          disabled={disabled}
          placeholder={placeholder}
          defaultValue={defaultValue ? defaultValue : undefined}
          minLength={minLength}
          // Add min and max attributes for number type
          min={type === "number" ? min : undefined}
          max={type === "number" ? max : undefined}
          maxLength={maxLength}
          // Reset validation error when the user interacts with the input
          onInput={() => setValidationError(null)}
          // Call onChange prop if provided when input value changes
          onChange={(event) => {
            let { value } = event.target;
            if (type === "number" && maxLength && value.length > maxLength) {
              value = value.slice(0, maxLength);
            }
            if (formatNumber) {
              value = formatCostInputValue(value);
            }
            if (endWith) {
              const isBackspace =
                (event?.nativeEvent as InputEvent).inputType ===
                "deleteContentBackward";
              value = value.replace(new RegExp(`${endWith}`), "").trim();
              if (isBackspace && value.length > 0) {
                value = value.slice(0, -1);
              }
              value = `${value} ${endWith}`;
            }
            if (isPinField) {
              value = value.replace(/\D/g, ""); // Remove non-numeric characters
            }
            event.target.value = value;
            onChange?.(value, event);
          }}
          type={type === "password" && isPasswordVisible ? "text" : type}
          // Input styles
          className={clsx(
            "p-3 text-xs md:text-sm font-normal rounded-[4px] w-full custom-primary-outline border border-solid border-[#C1C2C366] bg-neutral-2 dark:bg-darkText-primary hover:border-[#00000099] dark:hover:border-darkText-2 transition-colors duration-300 ease-in-out",
            {
              "pr-11": type === "password", // Add padding-right if the input type is password (for icon)
              "pl-11": leftIcon, // Add padding-left if leftIcon is provided
              "pl-10": CURRENCY_SYMBOL,
              "cursor-not-allowed": disabled,
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
            className="absolute p-1 right-3"
            aria-label="Toggle password visibility"
          >
            {isPasswordVisible ? <EyeShowIcon /> : <EyeHideIcon />}
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