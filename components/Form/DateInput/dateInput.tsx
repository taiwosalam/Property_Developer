"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { DateInputProps } from "./types";
// import CalendarIcon from "@/public/icons/calendar.svg";
import clsx from "clsx";
import Label from "../Label/label";

const DateInput: React.FC<DateInputProps> = ({
  id,
  value,
  label,
  className,
  required,
  placeholder,
  initialValue,
  onChange,
  inputTextStyles,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  // Set the input's "value" to an "initial value" when component mounts or when initialValue changes
  useEffect(() => {
    if (initialValue !== undefined && onChange != undefined) {
      onChange(initialValue);
    }
  }, [initialValue, onChange]);

  // Handler to open the date picker when the custom button is clicked
  const handleButtonClick = () => {
    if (inputRef.current) {
      console.log("Button clicked, triggering input click");
      inputRef.current.focus(); // Ensure the input is focused
      inputRef.current.click(); // Trigger click
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
      <div className="relative flex items-center">
        {/* Custom calendar icon */}
        <button
          type="button"
          aria-label="Pick Date"
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
          onClick={handleButtonClick}
        >
          <Image
            src="/icons/calendar.svg"
            alt="Calendar Icon"
            height={18}
            width={16.5}
          />
        </button>
        <input
          ref={inputRef}
          type="date"
          id={id}
          name={id}
          // value={value}
          placeholder={placeholder}
          // Call onChange prop if provided when input value changes
          onChange={({ target }) => onChange && onChange(target.value)}
          // Input styles
          className={clsx(
            "p-3 rounded-[4px] w-full focus:outline-brand-primary border border-solid bg-neutral-2",
            inputTextStyles
          )}
          style={{
            borderColor: "rgba(186, 199, 213, 0.50)",
          }}
        />
      </div>
    </div>
  );
};

export default DateInput;
