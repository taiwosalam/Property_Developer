"use client";

// Types
import type { DateInputProps } from "./types";

// Imports
import clsx from "clsx";
import Label from "../Label/label";
import DatePicker from "./date-picker";
import { Dayjs } from "dayjs";
// import { checkValidatonError } from "@/utils/validation";

const DateInput: React.FC<DateInputProps> = ({
  id,
  label,
  value,
  required,
  className,
  hiddenInputClassName,
  onChange,
}) => {
  const handleDateChange = (date?: Dayjs | null) => {
    if (onChange) {
      onChange(date);
    }
  };
 const formattedValue = value ? value.format("MM/DD/YYYY") : "";
  return (
    <div className={clsx("custom-flex-col gap-2", className)}>
      <input
        type="hidden"
        className={hiddenInputClassName}
        name={id}
        id={id}
        value={formattedValue}
      />
      {/* Render the label if provided */}
      {label && (
        <Label id={id} required={required}>
          {label}
        </Label>
      )}
      <DatePicker  onChange={handleDateChange} value={value} />
    </div>
  );
};

export default DateInput;
