import { ImportCircle, DeleteIconOrange } from "@/public/icons/icons";
import { useFileUploader } from "@/hooks/useFileUploader";
import { useState } from "react";
import { toast } from "sonner";
import { LandlordTenantInfoDocument } from "../landlord-tenant-info-components";
import Button from "@/components/Form/Button/button";

interface AddMultipleLandlordsOrTenantsProps {
    type: "landlord" | "tenant";
    method: "import" | "invite";
    submitAction: (file: File) => Promise<void>;
}

const UploadSignature: React.FC<
    AddMultipleLandlordsOrTenantsProps
> = ({ type, method, submitAction }) => {
    const [requestLoading, setRequestLoading] = useState(false);
    const acceptedExtensions = ["jpg", "jpeg", "png", "pdf"];
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
        acceptedExtensions,
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
                                Import file
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
                            link={fileURL as string}
                            file={file}
                        />
                    </div>
                )}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept=".jpg, .jpeg, .png, .pdf"
                onChange={handleFileChange}
            />
            <div className="flex justify-end gap-4 items-center">
                <p className="text-sm font-normal">
                    Please sign on a plain white paper and take a photo for uploading. If possible, remove the
                    background picture of the signature before uploading for a cleaner appearance.
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

export default UploadSignature;
