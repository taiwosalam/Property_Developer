import Image from "next/image";
import { useRef, useState } from "react";

// Images
import Button from "../Form/Button/button";
import ImportCircle from "@/public/icons/import-circle.svg";

interface AddMultipleLandlordsOrTenantsProps {
  type: "landlord" | "tenant";
  submitAction: (file: File) => void;
}

const AddMultipleLandlordsOrTenants: React.FC<
  AddMultipleLandlordsOrTenantsProps
> = ({ type, submitAction }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      submitAction(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      submitAction(file);
    }
  };

  return (
    <>
      <div className={`flex justify-center mb-5 md:mb-10 lg:mb-16`}>
        <div className="border-4 border-dotted py-8 md:py-12 px-28">
          <button
            type="button"
            aria-label="Import"
            className={`flex justify-center mx-auto ${
              isDragging ? "border-blue-500" : "border-black"
            }`}
            onClick={handleFileUploadClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Image src={ImportCircle} alt="import" width={120} height={120} />
          </button>
          <div className="custom-flex-col gap-[10px] text-center">
            <p className="text-base md:text-xl lg:text-2xl font-bold">
              Import XLS or CSV file
            </p>
            <p className="text-[#6C6D6D] text-[10px] font-medium">
              Please click to select a file or drag it into the designated area
              to upload.
            </p>
          </div>
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".xls,.xlsx,.csv"
        onChange={handleFileChange}
      />
      <div className="flex justify-between items-center">
        <p className="text-sm font-normal">
          How it works:{" "}
          <a
            href="/path-to-template-download" // Replace with the actual path
            className="text-brand-9 font-bold"
            download
          >
            Download the Template
          </a>
          , enter a list of your{" "}
          {type === "landlord" ? "landlords/landladies" : "tenants/occupants"}{" "}
          details, and then upload it to proceed.
        </p>
        <Button
          type="button"
          onClick={handleFileUploadClick}
          size="base_medium"
          className="py-2 px-8"
        >
          Choose
        </Button>
      </div>
    </>
  );
};

export default AddMultipleLandlordsOrTenants;
