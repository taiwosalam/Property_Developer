"use client";
import { useState, useEffect, useRef, useContext } from "react";
import { toast } from "sonner";
import type { FileInputProps } from "./types";
import useWindowDimensions from "@/hooks/useWindowDimensions";
import clsx from "clsx";
import Label from "../Label/label";
import Button from "../Button/button";
import { DeleteIconX, EyeShowIcon } from "@/public/icons/icons";
import { FlowProgressContext } from "@/components/FlowProgress/flow-progress";
import { SettingsVerifiedBadge } from "@/components/Settings/settings-components";

const FileInput: React.FC<FileInputProps> = ({
  id,
  label,
  className,
  hiddenInputClassName,
  textStyles,
  required,
  placeholder,
  buttonName,
  fileType,
  size,
  sizeUnit,
  settingsPage,
  defaultValue,
  noUpload,
  membership_status,
}) => {
  const { handleInputChange } = useContext(FlowProgressContext);
  const [file, setFile] = useState<File | null>(null);
  const [showVerifyBtn, setShowVerifyBtn] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileURL, setFileURL] = useState("");
  const { width } = useWindowDimensions();
  const [isLgScreen, setIsLgScreen] = useState(true);
  const [defaultFile, setDefaultFile] = useState<string>(defaultValue || "");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previousFileRef = useRef<File | null>(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    if (defaultValue) {
      setDefaultFile(defaultValue);
    }
  }, [defaultValue]);

  const restorePreviousFile = () => {
    if (previousFileRef.current) {
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(previousFileRef.current);
        fileInputRef.current.files = dataTransfer.files;
        handleInputChange?.();
        return;
      }
    } else {
      if (fileInputRef.current) {
        setFile(null);
        fileInputRef.current.value = "";
        handleInputChange?.();
        return;
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = event.target.files?.[0];
    if (!newFile) {
      //restorePreviousFile();
      return;
    }
    if (!fileType) {
      if (!newFile.type.startsWith("image/")) {
        toast.warning("Please upload an image file.");
        //restorePreviousFile();
        return;
      }
    } else {
      // If fileType is provided, allow both images and the specified file type
      const fileExtension = newFile.name.split(".").pop()?.toLowerCase();
      if (
        !newFile.type.startsWith("image/") &&
        fileExtension !== fileType.toLowerCase()
      ) {
        toast.warning(`Please upload a ${fileType} or image file.`);
        //restorePreviousFile();
        // setShowVerifyBtn(true);
        return;
      }
    }
    // Convert size to bytes based on sizeUnit
    const sizeInBytes = sizeUnit === "MB" ? size * 1024 * 1024 : size * 1024;

    // Validate file size
    if (newFile.size > sizeInBytes) {
      toast.warning(`File size should not exceed ${size} ${sizeUnit}.`);
      //restorePreviousFile();
      return;
    }
    setFile(newFile);
    setDefaultFile("");
    // setShowVerifyBtn(true);
  };

  const handleViewFile = () => {
    if (fileURL) {
      window.open(fileURL, "_blank");
    }
  };

  const handleView = () => {
    if (defaultValue) {
      window.open(defaultValue, "_blank");
    }
  };

  const handleDeleteFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    setIsLgScreen(width >= 1024);
  }, [width]);

  useEffect(() => {
    if (file) {
      setShowVerifyBtn(true);
      setFileURL(URL.createObjectURL(file));
      setFileName(file.name);
    } else {
      setFileURL("");
      setFileName("");
      setShowVerifyBtn(false);
    }
    handleInputChange?.();
    previousFileRef.current = file;
  }, [file, handleInputChange]);

  return (
    <div className={clsx("custom-flex-col gap-2", className)}>
      {label && (
        <Label id={id} required={required}>
          {label}
        </Label>
      )}
      <div
        className={`relative ${settingsPage && "flex"}  ${clsx(
          noUpload ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        )}`}
      >
        <input
          id={id}
          name={id}
          type="file"
          disabled={noUpload}
          // required={required}
          className={clsx(
            "absolute w-0 h-0 opacity-0 pointer-events-none",
            hiddenInputClassName,
            noUpload && "cursor-not-allowed"
          )}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <div
          role="button"
          aria-label="upload"
          onClick={handleClick}
          className={clsx(
            "p-3 rounded-[8px] w-full border border-solid border-[#C1C2C366] text-text-disabled text-xs md:text-sm font-normal overflow-hidden whitespace-nowrap text-ellipsis flex items-center justify-between hover:border-[#00000099] transition-colors duration-300 ease-in-out",
            textStyles,
            fileName ? "bg-neutral-2" : "bg-none"
          )}
        >
          {!settingsPage ? (
            <span
              className={clsx(
                "flex-1 overflow-hidden text-ellipsis whitespace-nowrap"
              )}
            >
              {fileName
                ? fileName
                : `Click ${isLgScreen ? "the side button" : "here"} to upload ${
                    placeholder || "file"
                  }`}
            </span>
          ) : (
            <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
              {noUpload
                ? "Click eye icon to view document"
                : "Click to upload document"}
            </span>
          )}

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
                <EyeShowIcon />
              </button>
              <button
                type="button"
                aria-label="Delete File"
                onClick={(e) => {
                  setDefaultFile("");
                  handleDeleteFile();
                  e.stopPropagation();
                }}
              >
                <DeleteIconX />
              </button>
            </div>
          )}

          {defaultFile && !fileURL && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="View File"
                onClick={(e) => {
                  handleView();
                  e.stopPropagation();
                }}
              >
                <EyeShowIcon />
              </button>
            </div>
          )}
        </div>
        {!settingsPage && (
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
        )}
        {(defaultFile) && membership_status && (
          <div className="flex pt-2 sm:pt-7 ml-3">
            <SettingsVerifiedBadge status={membership_status} />
          </div>
        )}
        {/* {settingsPage && showVerifyBtn && (
          <button className="text-xs w-1/2 sm:w-auto sm:mt-0 text-brand-9">
            Verify Document
          </button>
        )} */}
      </div>
    </div>
  );
};

export default FileInput;
