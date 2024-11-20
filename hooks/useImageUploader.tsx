"use client";

import { useRef, useState } from "react";

// Types
import type { useImageUploaderProps } from "./types";

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
}: useImageUploaderProps = {}) => {
  // State to store the image preview URL
  const [preview, setPreview] = useState(placeholder || null);

  // Ref to hold reference to the file input element
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  // Ref to store the last selected file
  const previousFileRef = useRef<File | null>(null);

  /**
   * Handles the change event when a file is selected from the file input.
   * If a valid image file is selected, it generates and sets the preview URL.
   * If the selected file is not an image, it retains the previous preview.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event from the file input element.
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Grab the first file selected

    // Check if the selected file is an image
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader(); // Create a FileReader to read the file

      // Set the preview once the image file has been read
      reader.onloadend = () => {
        setPreview(reader.result as string); // Set image preview with the result
        previousFileRef.current = file; // Update the previous file ref with the new file
      };

      reader.readAsDataURL(file); // Read the file as a data URL for the preview
    } else if (!file) {
      // No file selected
      if (previousFileRef.current) {
        // If there was a previous file, create a DataTransfer object
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(previousFileRef.current); // Add the previous file to the DataTransfer

        e.target.files = dataTransfer.files; // Assign the previous file to the input's files
      } else {
        setPreview(placeholder || null);
        toast.warning("No file selected."); // Show a warning toast
      }
    } else {
      toast.warning("Selected file is not a valid image type."); // Warn if the selected file is not an image
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
