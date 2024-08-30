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
  textStyles,
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

  const acceptedFormats = fileType
    ? [`.${fileType}`, "image/jgp", "image/jpeg", "image/png", "image/gif"]
    : ["image/jgp", "image/jpeg", "image/png", "image/gif"];

  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click(); // Open file dialog
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      const typeOfFile = file.type;

      // Validate file type
      if (
        !acceptedFormats.includes(`.${fileExtension}`) &&
        !acceptedFormats.includes(typeOfFile)
      ) {
        alert(`Please upload a ${fileType} or image file.`);
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
    if (inputRef.current) {
      inputRef.current.value = ""; // Reset file input value
    }
    setFileName(null);
    setFileURL(null);
    onChange && onChange(null);
  };

  return (
    <div className={clsx("custom-flex-col gap-2", className)}>
      {/* Render the label if provided */}
      {label && (
        <Label id={id} required={required}>
          {label}
        </Label>
      )}
      <div className="relative">
        <input
          id={id}
          name={id}
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
        <div
          className={clsx(
            "p-3 rounded-[4px] w-full custom-primary-outline border border-solid text-text-disabled text-sm font-normal overflow-hidden whitespace-nowrap text-ellipsis flex items-center justify-between",
            fileName ? "bg-neutral-2" : "bg-none"
          )}
          style={{
            borderColor: "rgba(186, 199, 213, 0.50)",
          }}
        >
          <span
            className={clsx(
              "flex-1 overflow-hidden text-ellipsis whitespace-nowrap",
              textStyles
            )}
          >
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
        <div className="hidden lg:block absolute left-[calc(100%+8px)] top-1/2 transform -translate-y-1/2">
          <Button
            variant="change"
            size="sm"
            className="whitespace-nowrap text-ellipsis"
            style={{ background: fileName ? "" : "none" }}
            type="button"
            onClick={handleButtonClick}
          >
            {fileName ? `Change ${buttonName}` : `Upload ${buttonName}`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FileInput;
