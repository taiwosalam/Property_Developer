"use client";

import { useRef, useState } from "react";
import type { FileInputProps } from "./types";
import clsx from "clsx";
import Label from "../Label/label";
import Button from "../Button/button";

const FileInput: React.FC<FileInputProps> = ({
  id,
  label,
  className,
  required,
  onChange,
  placeholder,
  buttonName
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click(); // Open file dialog
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onChange && onChange(file); // Call onChange if provided
    } else {
      setFileName(null); // Clear file name if no file is selected
    }
  };

  return (
    <div className="flex flex-1 gap-2">
      <div className={clsx("custom-flex-col gap-2", className)}>
        {/* Render the label if provided */}
        {label && (
          <Label id={id} required={required}>
            {label}
          </Label>
        )}
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type="file"
            id={id}
            name={id}
            className="hidden"
            onChange={handleFileChange}
          />
          <div
            className={clsx(
              "p-3 rounded-[4px] w-full focus:outline-brand-primary border border-solid text-text-disabled text-sm font-normal max-w-[300px] overflow-hidden whitespace-nowrap text-ellipsis",
              fileName ? "bg-neutral-2" : "bg-none"
            )}
            style={{
              borderColor: "rgba(186, 199, 213, 0.50)",
            }}
          >
            {fileName
              ? fileName
              : placeholder
              ? placeholder
              : "Click the side button to upload yout document"}
          </div>
          <div className="flex items-end">
            <Button
              variant="change"
              size="sm"
              style={{ background: "none" }}
              type="button"
              onClick={handleButtonClick}
            >
              {fileName ? `Change ${buttonName}` : `Upload ${buttonName}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileInput;
