"use client";

import { useRef, useState } from "react";

// Types
import type { UseImageUploaderProps } from "./types";

// Imports
import { toast } from "sonner";

/**
 * Custom hook to manage image file input and display image preview.
 *
 * @param {Object} [props] - Optional properties for the hook.
 * @param {string} [props.placeholder] - Initial image URL to be displayed as the preview.
 *
 * @returns {Object} - The returned object contains:
 * - `preview` {string | null}: The image preview URL.
 * - `setPreview` {(url: string) => void}: A function to set the image preview URL.
 * - `inputFileRef` {React.RefObject<HTMLInputElement>}: Reference to the file input element.
 * - `handleImageChange` {(e: React.ChangeEvent<HTMLInputElement>) => void}: A function to handle file input changes and set the image preview.
 */
export const useImageUploader = ({
  placeholder,
  maxSize,
}: UseImageUploaderProps = {}) => {
  const [preview, setPreview] = useState(placeholder || null);
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const previousFileRef = useRef<File | null>(null);

  const restorePreviousFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (previousFileRef.current && inputFileRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(previousFileRef.current);
      e.target.files = dataTransfer.files;
      return;
    }
    if (!previousFileRef.current && inputFileRef.current) {
      inputFileRef.current.value = "";
      setPreview(placeholder || null);
    }
  };

  /**
   * Handles the change event when a file is selected from the file input.
   * If a valid image file is selected, it generates and sets the preview URL.
   * If the selected file is not an image, it retains the previous preview.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event from the file input element.
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file && file.type.startsWith("image/")) {
      if (maxSize) {
        const sizeInBytes =
          maxSize.unit === "MB"
            ? maxSize.value * 1024 * 1024
            : maxSize.value * 1024;
        if (file.size > sizeInBytes) {
          toast.warning(
            `File size should not exceed ${maxSize.value} ${maxSize.unit}.`
          );
          restorePreviousFile(e);
          return;
        }
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        previousFileRef.current = file;
      };

      reader.readAsDataURL(file);
    } else if (!file) {
      restorePreviousFile(e);
    } else {
      toast.warning("Selected file is not a valid image type.");
      restorePreviousFile(e);
    }
  };

  const clearSelection = () => {
    setPreview(placeholder || null); // Clear the image preview
    previousFileRef.current = null;
    if (inputFileRef.current) {
      inputFileRef.current.value = ""; // Clear the file input
    }
  };

  return {
    preview, // The image preview URL
    setPreview, // Function to set the image preview URL
    inputFileRef, // Reference to the input element
    handleImageChange, // The handler for file input changes
    clearSelection, // Function to clear the image selection
  };
};
