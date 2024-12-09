import { useState, useRef } from "react";
import { toast } from "sonner";

interface UploadedFile {
  file: File;
  fileName: string;
  fileURL: string;
}

interface UseMultipleFileUploadProps {
  maxFiles?: number;
  maxFileSizeMB?: number;
  acceptedExtensions?: string[];
  onFilesUpdate?: (files: UploadedFile[]) => void;
}

interface UseMultipleFileUploadReturn {
  uploadedFiles: UploadedFile[];
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (index: number) => void;
  handleFileReorder: (sourceIndex: number, destinationIndex: number) => void;
  resetFiles: () => void;
}

export const useMultipleFileUpload = ({
  maxFiles,
  maxFileSizeMB = 10,
  acceptedExtensions,
  onFilesUpdate,
}: UseMultipleFileUploadProps): UseMultipleFileUploadReturn => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let selectedFiles = Array.from(e.target.files || []);
    // Apply maxFiles limit if defined
    if (maxFiles !== undefined) {
      selectedFiles = selectedFiles.slice(0, maxFiles - uploadedFiles.length);
    }
    const validFiles: UploadedFile[] = [];
    const oversizeFiles: string[] = [];
    const invalidFiles: string[] = [];

    for (const file of selectedFiles) {
      if (
        acceptedExtensions &&
        !acceptedExtensions.includes(file.type.split("/").pop() || "")
      ) {
        invalidFiles.push(file.name);
        continue;
      }
      if (file.size > maxFileSizeMB * 1024 * 1024) {
        oversizeFiles.push(file.name);
        continue;
      }
      const fileURL = URL.createObjectURL(file);
      validFiles.push({ file, fileName: file.name, fileURL });
    }

    if (oversizeFiles.length > 0) {
      toast.warning(
        `Some files were not uploaded due to exceeding the maximum size: ${maxFileSizeMB} MB`
      );
    }
    if (invalidFiles.length > 0) {
      toast.warning(
        `Some files were not uploaded due to invalid file type. Accepted types: ${acceptedExtensions?.join(
          ", "
        )}`
      );
    }
    const newFiles = [...uploadedFiles, ...validFiles].slice(0, maxFiles);
    setUploadedFiles(newFiles);
    onFilesUpdate?.(newFiles);
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index);
      onFilesUpdate?.(newFiles);
      return newFiles;
    });
  };

  const handleFileReorder = (sourceIndex: number, destinationIndex: number) => {
    setUploadedFiles((prev) => {
      const newFiles = Array.from(prev);
      const [movedFile] = newFiles.splice(sourceIndex, 1);
      newFiles.splice(destinationIndex, 0, movedFile);
      onFilesUpdate?.(newFiles);
      return newFiles;
    });
  };

  const resetFiles = () => {
    setUploadedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return {
    uploadedFiles,
    fileInputRef,
    handleFileChange,
    removeFile,
    handleFileReorder,
    resetFiles,
  };
};
