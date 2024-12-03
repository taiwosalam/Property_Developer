import { useState, useRef } from "react";
import { toast } from "sonner";

interface UseMultipleImageUploadProps {
  maxImages: number;
  maxFileSizeMB: number;
}

interface UseMultipleImageUploadReturn {
  images: string[];
  imageFiles: File[];
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  handleImageReorder: (sourceIndex: number, destinationIndex: number) => void;
  resetImages: () => void;
}

export const useMultipleImageUpload = ({
  maxImages,
  maxFileSizeMB,
}: UseMultipleImageUploadProps): UseMultipleImageUploadReturn => {
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(
      0,
      maxImages - images.length
    );
    const validImages: string[] = [];
    const validFiles: File[] = [];
    const oversizeImages: string[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        toast.warning("Upload only image files.");
        return;
      }
      if (file.size > maxFileSizeMB * 1024 * 1024) {
        oversizeImages.push(file.name);
        continue;
      }
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          validImages.push(reader.result as string);
          if (validImages.length + oversizeImages.length === files.length) {
            setImages((prev) => [...prev, ...validImages].slice(0, maxImages));
            setImageFiles((prev) =>
              [...prev, ...validFiles].slice(0, maxImages)
            );
          }
        };
        reader.readAsDataURL(file);
        validFiles.push(file);
      } catch (error) {
        console.error("Error processing image:", error);
        toast.warning(
          "There was an error processing your image. Please try again."
        );
      }
    }

    if (oversizeImages.length > 0) {
      toast.warning(
        `Some files were not uploaded due to exceeding the maximum size: ${maxFileSizeMB} MB`
      );
    }
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageReorder = (
    sourceIndex: number,
    destinationIndex: number
  ) => {
    setImages((prev) => {
      const newImages = Array.from(prev);
      const [movedImage] = newImages.splice(sourceIndex, 1);
      newImages.splice(destinationIndex, 0, movedImage);
      return newImages;
    });

    setImageFiles((prev) => {
      const newFiles = Array.from(prev);
      const [movedFile] = newFiles.splice(sourceIndex, 1);
      newFiles.splice(destinationIndex, 0, movedFile);
      return newFiles;
    });
  };

  const resetImages = () => {
    setImages([]);
    setImageFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return {
    images,
    imageFiles,
    fileInputRef,
    handleFileChange,
    removeImage,
    handleImageReorder,
    resetImages,
  };
};
