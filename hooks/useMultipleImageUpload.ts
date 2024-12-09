import { useState, useRef } from "react";
import { toast } from "sonner";

interface UseMultipleImageUploadProps {
  maxImages: number;
  maxFileSizeMB: number;
  initialImages?: string[];
  onImagesUpdate?: (a: {
    images: string[];
    imageFiles: (string | File)[];
  }) => void;
}

interface UseMultipleImageUploadReturn {
  images: string[];
  imageFiles: (string | File)[];
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  handleImageReorder: (sourceIndex: number, destinationIndex: number) => void;
  resetImages: () => void;
}

export const useMultipleImageUpload = ({
  maxImages,
  maxFileSizeMB,
  initialImages = [],
  onImagesUpdate,
}: UseMultipleImageUploadProps): UseMultipleImageUploadReturn => {
  const [images, setImages] = useState<string[]>(initialImages);
  const [imageFiles, setImageFiles] = useState<(string | File)[]>(
    initialImages || []
  );
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
            onImagesUpdate?.({
              images: [...images, ...validImages],
              imageFiles: [...imageFiles, ...validFiles],
            });
          }
        };
        reader.readAsDataURL(file);
        validFiles.push(file);
      } catch (error) {
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
    const newImages = images.filter((_, i) => i !== index);
    const newImageFiles = imageFiles.filter((_, i) => i !== index);
    setImages(newImages);
    setImageFiles(newImageFiles);
    onImagesUpdate?.({
      images: newImages,
      imageFiles: newImageFiles,
    });
  };

  const handleImageReorder = (
    sourceIndex: number,
    destinationIndex: number
  ) => {
    const newImages = Array.from(images);
    const [movedImage] = newImages.splice(sourceIndex, 1);
    newImages.splice(destinationIndex, 0, movedImage);
    setImages(newImages);

    const newImageFiles = Array.from(imageFiles);
    const [movedFile] = newImageFiles.splice(sourceIndex, 1);
    newImageFiles.splice(destinationIndex, 0, movedFile);
    setImageFiles(newImageFiles);
    onImagesUpdate?.({
      images: newImages,
      imageFiles: newImageFiles,
    });
  };

  const resetImages = () => {
    setImages(initialImages || []);
    setImageFiles(initialImages || []);
    onImagesUpdate?.({
      images: initialImages || [],
      imageFiles: initialImages || [],
    });
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
