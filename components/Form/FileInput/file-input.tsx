"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import type { FileInputProps } from "./types";
import clsx from "clsx";
import Label from "../Label/label";
import Button from "../Button/button";
import deleteIcon from "@/public/icons/delete-icon.svg";
import eyeShowIcon from "@/public/icons/eye-show.svg";

const FileInput: React.FC<FileInputProps> = ({
  id,
  label,
  className,
  required,
  onChange,
  placeholder,
  buttonName,
  fileType,
  size,
  sizeUnit,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileURL, setFileURL] = useState<string | null>(null);

  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click(); // Open file dialog
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type if fileType prop is provided
      if (fileType && !file.name.endsWith(`.${fileType}`)) {
        alert(`Please upload a ${fileType} file.`);
        return;
      }

      // Convert size to bytes based on sizeUnit
      const sizeInBytes = sizeUnit === "MB" ? size * 1024 * 1024 : size * 1024;

      // Validate file size
      if (file.size > sizeInBytes) {
        alert(
          `File size should not exceed ${
            sizeUnit === "MB" ? size / 1024 : size
          } ${sizeUnit}.`
        );
        return;
      }

      setFileName(file.name);
      setFileURL(URL.createObjectURL(file)); // Create a URL for the file to view it in another tab
      onChange && onChange(file); // Call onChange if provided
    }
  };
  const handleViewFile = () => {
    if (fileURL) {
      window.open(fileURL, "_blank");
    }
  };

  const handleDeleteFile = () => {
    setFileName(null);
    setFileURL(null);
    onChange && onChange(null)
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
        <div className="relative flex items-center gap-2">
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
              "p-3 rounded-[4px] w-full focus:outline-brand-primary border border-solid text-text-disabled text-sm font-normal max-w-[300px] overflow-hidden whitespace-nowrap text-ellipsis flex items-center justify-between",
              fileName ? "bg-neutral-2" : "bg-none"
            )}
            style={{
              borderColor: "rgba(186, 199, 213, 0.50)",
            }}
          >
            <span>
              {fileName
                ? fileName
                : placeholder
                ? placeholder
                : "Click the side button to upload your file"}
            </span>
            {fileName && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="View File"
                  onClick={handleViewFile}
                >
                  <Image src={eyeShowIcon} alt="View File" />
                </button>
                <button
                  type="button"
                  aria-label="Delete File"
                  onClick={handleDeleteFile}
                >
                  <Image src={deleteIcon} alt="Delete File" />
                </button>
              </div>
            )}
          </div>
          <div className="flex items-end">
            <Button
              variant="change"
              size="sm"
              style={{ background: fileName ? "" : "none" }}
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
