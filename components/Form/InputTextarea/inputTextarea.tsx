"use client";

// Types
import type { InputTextareaProps } from "./types";

// Imports
import clsx from "clsx";
import Label from "../Label/label";

const InputTextarea: React.FC<InputTextareaProps> = ({
  id,
  label,
  style,
  value,
  required,
  className,
  placeholder,
  onChange,
  textAreaClassName,
  disabled,
  rows = 3, // Default number of rows
}) => {
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
        <Label id={id} required={required}>
          {label}
        </Label>
      )}
      <div className="relative flex items-center">
        <textarea
          id={id}
          name={id}
          value={value}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          rows={rows}
          onChange={({ target }) => onChange && onChange(target.value)}
          className={clsx(
            "p-3 text-xs md:text-sm font-normal rounded-[4px] w-full custom-primary-outline border border-solid border-[#C1C2C366] hover:border-[#00000099] transition-colors duration-300 ease-in-out",
            {
              "cursor-not-allowed": disabled,
            },
            textAreaClassName
          )}
          style={style} // Add custom border color
        />
      </div>
    </div>
  );
};

export default InputTextarea;
