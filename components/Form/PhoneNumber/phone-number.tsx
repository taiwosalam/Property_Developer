"use client";

// Types
import type { PhoneNumberProps } from "./types";

// Imports
import clsx from "clsx";
import Label from "../Label/label";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const PhoneNumberInput: React.FC<PhoneNumberProps> = ({
  id,
  label,
  value,
  required,
  className,
  placeholder,
  onChange,
  inputClassName,
  inputContainerClassName,
}) => {
  return (
    <div className={clsx("custom-flex-col gap-2", className)}>
      {/* Render the label if provided */}
      {label && (
        <Label id={id} required={required}>
          {label}
        </Label>
      )}
      <PhoneInput
        country={"ng"} // Default country code (Nigeria)
        value={value}
        onChange={onChange} // Update with selected phone number
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
        inputClass={(clsx( "!pt-[9px] !pb-[9px] !h-[unset]",inputClassName))}
        inputStyle={{ border: "1px solid #C1C2C366", borderRadius: "8px" }}
        buttonStyle={{
          border: "1px solid #C1C2C366",
          borderRadius: "8px 0 0 8px",
        }}
        containerClass="!text-xs !md:text-sm font-normal"
      />
    </div>
  );
};

export default PhoneNumberInput;
