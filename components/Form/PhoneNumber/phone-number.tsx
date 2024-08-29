"use client";

// Types
import type { PhoneNumberProps } from "./types";

// Imports
import clsx from "clsx";
import Label from "../Label/label";

const PhoneNumberInput: React.FC<PhoneNumberProps> = ({
  id,
  label,
  value,
  required,
  className,
  placeholder,
  onChange,
  inputTextStyles,
}) => {
  // Function to format the phone number as "000 0000 000"
  const formatPhoneNumber = (input: string) => {
    // Remove any non-numeric characters
    const numbersOnly = input.replace(/\D/g, "");

    // Format as "000 0000 000"
    const formattedNumber = numbersOnly
      .replace(/(\d{3})(\d{4})(\d{0,3})/, "$1 $2 $3")
      .trim();

    return formattedNumber;
  };

  // Handle input change and format the value
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(event.target.value);
    onChange && onChange(formattedValue); // Call the provided onChange handler with formatted value
  };
  return (
    <div className={clsx("custom-flex-col gap-2", className)}>
      {/* Render the label if provided */}
      {label && (
        <Label id={id} required={required}>
          {label}
        </Label>
      )}
      <div className="relative flex items-center">
        <div className="bg-[#F3F6F9] p-3 text-center text-text-disabled rounded-l-[4px] border border-solid border-r-0 h-[50px]">
          +234
        </div>
        <input
          id={id}
          name={id}
          value={value}
          placeholder={placeholder}
          type="text"
          maxLength={12}
          onChange={handleInputChange}
          // Input styles
          className={clsx(
            "p-3 w-full custom-primary-outline border border-solid rounded-r-[4px] border-l-0 h-[50px]",
            inputTextStyles
          )}
          style={{ borderColor: "rgba(186, 199, 213, 0.50)" }} // Add custom border color
        />
      </div>
    </div>
  );
};

export default PhoneNumberInput;
