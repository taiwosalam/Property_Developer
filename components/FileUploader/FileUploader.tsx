
import React, { useRef } from "react";

interface FileUploadProps {
  id: string;
  label?: string;
  onFileChange: (file: File | null) => void;
  file: File | null;
  disabled?: boolean;
}

const getFileIcon = (file: File | null) => {
  if (!file) return null;
  const type = file.type;
  if (type.startsWith("image/")) return <span role="img" aria-label="image">🖼️</span>;
  if (type === "application/pdf") return <span role="img" aria-label="pdf">📄</span>;
  if (type.startsWith("video/")) return <span role="img" aria-label="video">🎬</span>;
  return <span role="img" aria-label="file">📁</span>;
};

const FileUploader: React.FC<FileUploadProps> = ({ id, label, onFileChange, file, disabled }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-2">
      {label && <label htmlFor={id}>{label}</label>}
      <input
        id={id}
        type="file"
        ref={inputRef}
        className={`${disabled ? "opacity-40 cursor-not-allowed" : "opacity-100"} hidden`}
        disabled={disabled}
        onChange={e => {
          const selectedFile = e.target.files && e.target.files[0] ? e.target.files[0] : null;
          onFileChange(selectedFile);
        }}
      />
      <button
        type="button"
        className="border rounded px-3 py-2 bg-white flex items-center gap-2"
        onClick={() => inputRef.current?.click()}
      >
        {file ? (
          <>
            {getFileIcon(file)}
            <span className="truncate max-w-[200px]">{file.name}</span>
          </>
        ) : (
          "Upload a file"
        )}
      </button>
    </div>
  );
};

export default FileUploader;