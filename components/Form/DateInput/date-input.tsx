"use client";

import { useEffect, useState } from "react";

// Types
import type { DateInputProps } from "./types";

// Imports
import clsx from "clsx";
import Label from "../Label/label";
import DatePicker from "./date-picker";
// import { checkValidatonError } from "@/utils/validation";

const DateInput: React.FC<DateInputProps> = ({
  id,
  label,
  value,
  required,
  className,
  initialValue,
  //   validationErrors = {},
  onChange,
}) => {
  // State to store validation error message
  //   const [validationError, setValidationError] = useState<string | null>(null);

  // Set the input's "value" to an "initial value" when component mounts or when initialValue changes
  useEffect(() => {
    if (initialValue !== undefined && onChange != undefined) {
      onChange(initialValue);
    }
  }, [initialValue, onChange]);

  // Check and set validation error for this input when validationErrors or id changes
  //   useEffect(() => {
  //     setValidationError(
  //       checkValidatonError({ errors: validationErrors, key: id })
  //     );
  //   }, [validationErrors, id]);

  return (
    <div className={clsx("custom-flex-col gap-2", className)}>
      {/* Render the label if provided */}
      {label && (
        <Label id={id} required={required}>
          {label}
        </Label>
      )}
      <DatePicker
        className="h-[50px] p-4"
        textStyles="text-text-disabled text-[12px] font-normal"
      />
    </div>
  );
};

export default DateInput;
