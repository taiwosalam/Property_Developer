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
  lastYear,
  containerClassName,
  labelclassName,
  disabled,
}) => {
  const handleDateChange = (date: Dayjs | null) => {
    if (onChange) {
      onChange(date);
      console.log("date: ", date);
    }
  };

  return (
    <div className={clsx("custom-flex-col gap-2", className)}>
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
        lastYear={lastYear}
        containerClassName={containerClassName}
        disabled={disabled}
      />
    </div>
  );
};

export default DateInput;
