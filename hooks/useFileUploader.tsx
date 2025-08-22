"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";

// Types
interface UseFileUploaderProps {
  maxSize?: {
    unit: "KB" | "MB";
    value: number;
  };
  acceptedExtensions?: string[];
}

export const useFileUploader = ({
  maxSize = { unit: "MB", value: 10 },
  acceptedExtensions,
}: UseFileUploaderProps = {}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileURL, setFileURL] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const sizeInBytes =
      maxSize.unit === "MB"
        ? maxSize.value * 1024 * 1024
        : maxSize.value * 1024;
    if (selectedFile.size > sizeInBytes) {
      toast.warning(
        `File size should not exceed ${maxSize.value} ${maxSize.unit}.`
      );
      return;
    }

    if (acceptedExtensions) {
      const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();
      if (!acceptedExtensions.includes(fileExtension || "")) {
        toast.warning(
          `Please upload a file with one of the following extensions: ${acceptedExtensions.join(
            ", "
          )}.`
        );
        return;
      }
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setFileURL(URL.createObjectURL(selectedFile));
  };

  const clearFile = () => {
    setFile(null);
    setFileName("");
    setFileURL(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return {
    file,
    fileName,
    fileURL,
    fileInputRef,
    handleFileChange,
    handleDrop,
    clearFile,
  };
};
