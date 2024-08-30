"use client";

// Types
import type { DateInputProps } from "./types";

// Imports
import clsx from "clsx";
import Label from "../Label/label";
// import { DatePicker } from "@nextui-org/react";
import DatePicker from "./date-picker";
import { getLocalTimeZone, today } from "@internationalized/date";
// import { checkValidatonError } from "@/utils/validation";

const DateInput: React.FC<DateInputProps> = ({
  id,
  label,
  value,
  required,
  className,
  textStyles,
  //   validationErrors = {},
  onChange,
}) => {
  // State to store validation error message
  //   const [validationError, setValidationError] = useState<string | null>(null);

  const handleDateChange = (date: Date | undefined) => {
    if (onChange) {
      onChange(date);
    }
  };

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
        className="p-4 h-[50px]"
        textStyles={clsx("text-text-disabled", textStyles)}
        // label="outside"
        // maxValue={today(getLocalTimeZone())}
        dateValueProp={value}
        onDateChange={handleDateChange}
      />
    </div>
  );
};

export default DateInput;
