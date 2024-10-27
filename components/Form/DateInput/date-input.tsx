"use client";

// Types
import type { DateInputProps } from "./types";

// Imports
import clsx from "clsx";
import Label from "../Label/label";
import DatePicker from "./date-picker";
import { Dayjs } from "dayjs";

const DateInput: React.FC<DateInputProps> = ({
  id,
  label,
  value,
  required,
  className,
  inputClassName,
  onChange,
  minDate,
  maxDate,
  disableFuture,
  disablePast,
  containerClassName,
  labelclassName,
  disabled,
}) => {
  const handleDateChange = (date?: Dayjs | null) => {
    if (onChange) {
      onChange(date);
    }
  };

  return (
    <div className={clsx("custom-flex-col gap-2", className)}>
      {/* Render the label if provided */}
      {label && (
        <Label id={id} required={required} labelclassName={labelclassName}>
          {label}
        </Label>
      )}
      <DatePicker
        inputId={id}
        inputClassName={inputClassName}
        onChange={handleDateChange}
        value={value}
        minDate={minDate}
        maxDate={maxDate}
        disableFuture={disableFuture}
        disablePast={disablePast}
        containerClassName={containerClassName}
        disabled={disabled}
      />
    </div>
  );
};
// F3F6F9
export default DateInput;
