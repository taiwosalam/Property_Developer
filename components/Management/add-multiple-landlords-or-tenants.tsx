// Images
import Button from "../Form/Button/button";
import { ImportCircle, DeleteIconOrange } from "@/public/icons/icons";
import { useFileUploader } from "@/hooks/useFileUploader";
import { useState } from "react";
import { toast } from "sonner";
import { LandlordTenantInfoDocument } from "./landlord-tenant-info-components";

interface AddMultipleLandlordsOrTenantsProps {
  type: "landlord" | "tenant";
  method: "import" | "invite";
  submitAction: (file: File) => Promise<void>;
}

const AddMultipleLandlordsOrTenants: React.FC<
  AddMultipleLandlordsOrTenantsProps
> = ({ type, method, submitAction }) => {
  const [requestLoading, setRequestLoading] = useState(false);
  const {
    file,
    fileName,
    fileInputRef,
    handleFileChange,
    handleDrop,
    clearFile,
    fileURL,
  } = useFileUploader({
    maxSize: { unit: "MB", value: 5 },
    acceptedExtensions: ["xls", "xlsx", "csv"],
  });

  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async () => {
    if (file) {
      setRequestLoading(true);
      await submitAction(file);
      setRequestLoading(false);
    } else {
      toast.warning("Please select a file to upload.");
    }
  };

  const downloadLink =
    method === "invite"
      ? "bulk-invite-template.xlsx"
      : type === "landlord"
      ? "bulk-landlord-import-template.xlsx"
      : "bulk-tenant-import-template.xlsx";

  return (
    <>
      <div
        className="max-w-[570px] mx-auto mb-5 md:mb-8 lg:mb-12 border-4 border-dotted dark:border-darkText-2 py-8 md:py-12"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {!file ? (
          <>
            <button
              type="button"
              aria-label="Import"
              className="flex justify-center mx-auto"
              onClick={handleFileUploadClick}
            >
              <span className="dark:bg-darkText-primary bg-neutral-2 dark:text-white rounded-full">
                <ImportCircle />
              </span>
            </button>
            <div className="custom-flex-col gap-[10px] text-center">
              <p className="text-base md:text-xl lg:text-2xl font-bold">
                Import XLS or CSV file
              </p>
              <p className="text-[#6C6D6D] text-sm font-medium">
                Please click to select a file{" "}
                <span className="hidden md:inline">
                  or drag it into the designated area
                </span>{" "}
                to upload.
              </p>
            </div>
          </>
        ) : (
          <div className="relative w-fit mx-auto">
            <button
              aria-label="remove file"
              className="absolute top-0 right-0"
              onClick={clearFile}
            >
              <DeleteIconOrange size={20} />
            </button>

            <LandlordTenantInfoDocument
              name={fileName}
              id="uploaded-file"
              link={fileURL as string}
            />
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".xls,.xlsx,.csv"
        onChange={handleFileChange}
      />
      <div className="flex justify-between gap-4 items-center">
        <p className="text-sm font-normal">
          How it works:{" "}
          <a
            href={`/templates/${downloadLink}`}
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
          onClick={handleSubmit}
          size="base_medium"
          className="py-2 px-8"
          disabled={requestLoading}
        >
          {requestLoading ? "Hang on..." : "Submit"}
        </Button>
      </div>
    </>
  );
};

export default AddMultipleLandlordsOrTenants;
