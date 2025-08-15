"use client";

// Types
import type { PhoneNumberProps } from "./types";

// Imports
import clsx from "clsx";
import { useState, useEffect } from "react";
import Label from "../Label/label";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import useDarkMode from "@/hooks/useCheckDarkMode";

const PhoneNumberInput: React.FC<PhoneNumberProps> = ({
  id,
  label,
  value,
  defaultValue,
  resetKey,
  required,
  className,
  placeholder,
  onChange,
  inputClassName,
  inputContainerClassName,
  disabled,
}) => {
  const [phoneValue, setPhoneValue] = useState(defaultValue);
  const isDarkMode = useDarkMode();
  useEffect(() => {
    setPhoneValue(value || defaultValue);
  }, [value, resetKey, defaultValue]);

  const handleChange = (newValue: string) => {
    setPhoneValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className={clsx("custom-flex-col gap-2", className)}>
      {/* Render the label if provided */}
      {label && (
        <Label id={id} required={required}>
          {label}
        </Label>
      )}
      <PhoneInput
        disabled={disabled}
        country="ng" // Default country code (Nigeria)
        value={phoneValue}
        onChange={handleChange}
        countryCodeEditable={false}
        enableSearch={true}
        preferredCountries={["ng", "us", "gb"]}
        disableSearchIcon={true}
        inputProps={{
          name: id,
          id: id,
          required: required,
          placeholder: placeholder,
        }}
        searchNotFound="No match found"
        inputClass={inputClassName}
        inputStyle={{
          width: "100%",
          borderRadius: "8px",
          fontSize: "inherit",
          background: "inherit",
          border: "none",
          height: "unset",
          paddingTop: "9px",
          paddingBottom: "9px",
        }}
        dropdownStyle={{
          borderRadius: "8px",
          background: isDarkMode ? "#121212" : "#FFFFFF",
          border: "none", 
          color: isDarkMode ? "#FFFFFF" : "#000000",
          fontFamily: "inherit",
        }}
        buttonStyle={{
          border: "none",
          borderRadius: "8px 0 0 8px",
          borderColor: "inherit",
          width: "40px",
          inset: "1px",
        }}
        containerStyle={{
          fontFamily: "inherit",
          padding: "1px",
        }}
        containerClass={clsx(
          "font-normal rounded-[8px] border border-solid border-[#C1C2C366] hover:border-[#00000099] dark:hover:border-darkText-2 transition-colors duration-300 ease-in-out custom-primary-outline dark:!bg-darkText-primary",
          inputContainerClassName
        )}
      />
    </div>
  );
};

export default PhoneNumberInput;
