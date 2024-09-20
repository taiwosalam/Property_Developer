import { useState } from "react";

// Types
import type { useImageUploaderProps } from "./types";

// Imports
import { empty } from "@/app/config";

/**
 * Custom hook to manage image file input and display image preview.
 *
 * @returns {Object} - The returned object contains:
 * - `preview` {string | null}: The image preview URL.
 * - `handleImageChange` {(e: React.ChangeEvent<HTMLInputElement>) => void}: A function to handle file input changes and set the image preview.
 */
export const useImageUploader = ({
  placeholder,
}: useImageUploaderProps = {}) => {
  const [preview, setPreview] = useState<string>(placeholder || empty);

  /**
   * Handles the change event when a file is selected from the file input.
   * If a valid image file is selected, it generates and sets the preview URL.
   * If the selected file is not an image, it retains the previous preview.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event from the file input element.
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Grab the first file selected

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();

      // Set the preview once the image file has been read
      reader.onloadend = () => {
        setPreview(reader.result as string); // Set image preview
      };

      reader.readAsDataURL(file); // Read the file as data URL for the preview
    }
    // No need to update the preview if a non-image file is selected
  };

  return {
    preview, // The image preview URL
    handleImageChange, // The handler for file input changes
  };
};
