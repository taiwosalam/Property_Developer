"use client";
import {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  RefObject,
  forwardRef,
  useImperativeHandle,
} from "react";
import { toast } from "sonner";
import clsx from "clsx";
import Label from "../Form/Label/label";// Adjust import based on your setup
import { UploadIcon, DeleteIcon } from "lucide-react"
import { DeleteIconX } from "@/public/icons/icons";

export interface FileUploadInputProps {
  id: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  size?: number;
  sizeUnit?: "MB" | "KB";
  disabled?: boolean;
  onChange?: (file: File | null) => void;
  className?: string;
  onClear?: () => void;
}

export interface FileUploadInputRef {
  clearFile: () => void;
}

const FileUploadInput = forwardRef<FileUploadInputRef, FileUploadInputProps>(
  (
    {
      id,
      label,
      placeholder = "SVG format only",
      required,
      size = 2,
      sizeUnit = "MB",
      disabled = false,
      onChange,
      className,
      onClear,
    },
    ref
  ) => {
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState("");
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
      const newFile = event.target.files?.[0];
      if (!newFile) {
        return;
      }

      // Validate SVG
      if (newFile.type !== "image/svg+xml") {
        toast.warning("Only SVG files are supported.");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      // Validate file size (2MB in bytes)
      const sizeInBytes = sizeUnit === "MB" ? size * 1024 * 1024 : size * 1024;
      if (newFile.size > sizeInBytes) {
        toast.warning(`File size should not exceed ${size} ${sizeUnit}.`);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      setFile(newFile);
      setFileName(newFile.name);
      onChange?.(newFile);
    };

    // Add this method to clear the input
    const clearFile = () => {
      setFile(null);
      setFileName("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onChange?.(null);
      onClear?.();
    };

    // Expose clearFile method through ref
    useImperativeHandle(ref, () => ({
      clearFile,
    }));

    const handleDeleteFile = () => {
      clearFile();
    };

    const handleClick = () => {
      if (!disabled && fileInputRef.current) {
        fileInputRef.current.click();
      }
    };

    return (
      <div className={clsx("custom-flex-col gap-2", className)}>
        {label && (
          <Label
            labelclassName={clsx("!opacity-100", {
              "!text-opacity-50 !opacity-50": disabled,
            })}
            id={id}
            required={required}
          >
            {label}
          </Label>
        )}
        <div className="relative  flex items-center w-full">
          <input
            id={id}
            name={id}
            type="file"
            disabled={disabled}
            className="absolute w-0 h-0 opacity-0 pointer-events-none"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/svg+xml"
          />
          <div
            role="button"
            aria-label="upload"
            onClick={handleClick}
            className={clsx(
              "p-3 rounded-[8px] w-full !min-h-[45px] border border-solid border-[#C1C2C366] text-text-disabled text-xs md:text-sm font-normal overflow-hidden whitespace-nowrap text-ellipsis flex items-center justify-between hover:border-[#00000099] transition-colors duration-300 ease-in-out",
              fileName ? "bg-neutral-2 dark:bg-transparent" : "bg-none",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
              {fileName || placeholder}
            </span>
            {fileName ? (
              <button
                type="button"
                aria-label="Delete File"
                onClick={(e) => {
                  handleDeleteFile();
                  e.stopPropagation();
                }}
                disabled={disabled}
                className="flex items-center"
              >
                <DeleteIconX />
              </button>
            ) : (
              <div className="absolute right-3 flex items-center z-10">
                <UploadIcon />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

FileUploadInput.displayName = "FileUploadInput";

export default FileUploadInput;
