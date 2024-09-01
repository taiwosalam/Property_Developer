"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import type { FileInputProps } from "./types";
import useWindowDimensions from "@/hooks/useWindowDimensions";
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
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileURL, setFileURL] = useState("");
  const { width } = useWindowDimensions();
  const [isLgScreen, setIsLgScreen] = useState(true);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSetFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (
      !file.type.startsWith("image/") &&
      fileExtension !== fileType?.toLowerCase()
    ) {
      alert(`Please upload a ${fileType} or image file.`);
      event.target.value = ""; // Clear the input field
      return;
    }
    // Convert size to bytes based on sizeUnit
    const sizeInBytes = sizeUnit === "MB" ? size * 1024 * 1024 : size * 1024;

    // Validate file size
    if (file.size > sizeInBytes) {
      alert(`File size should not exceed ${size} ${sizeUnit}.`);
      event.target.value = ""; // Clear the input field
      return;
    }
    setFile(file);
  };

  const handleViewFile = () => {
    if (fileURL) {
      window.open(fileURL, "_blank");
    }
  };

  const handleDeleteFile = () => {
    setFile(null);
  };

  useEffect(() => {
    setIsLgScreen(width >= 1024);
  }, [width]);

  useEffect(() => {
    if (file) {
      setFileURL(URL.createObjectURL(file));
      setFileName(file.name);
      onChange && onChange(file); // Call onChange if provided
    } else {
      setFileURL("");
      setFileName("");
      onChange && onChange(null);
    }
  }, [file, onChange]);

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
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleSetFile}
        />
        <div
          role="button"
          aria-label="upload"
          onClick={handleClick}
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
              : `Click ${isLgScreen ? "the side button" : "here"} to upload ${
                  placeholder || "file"
                }`}
          </span>
          {fileName && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="View File"
                onClick={(e) => {
                  handleViewFile();
                  e.stopPropagation();
                }}
              >
                <Image src={eyeShowIcon} alt="View File" />
              </button>
              <button
                type="button"
                aria-label="Delete File"
                onClick={(e) => {
                  handleDeleteFile();
                  e.stopPropagation();
                }}
                className="p-1"
              >
                <Image
                  src={deleteIcon}
                  alt="Delete File"
                  width={18}
                  height={18}
                  className="w-[18px] h-[18px]"
                />
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
            onClick={handleClick}
          >
            {fileName ? `Change ${buttonName}` : `Upload ${buttonName}`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FileInput;
