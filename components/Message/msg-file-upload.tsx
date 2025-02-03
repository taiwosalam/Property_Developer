import { ImportCircle, DeleteIconOrange } from "@/public/icons/icons";
import { useFileUploader } from "@/hooks/useFileUploader";
import { useState } from "react";
import { toast } from "sonner";
import Button from "@/components/Form/Button/button";
import { LandlordTenantInfoDocument } from "../Management/landlord-tenant-info-components";

interface AddMultipleLandlordsOrTenantsProps {
    accept?: string;
    heading?: string;
    submitAction: (file: File) => Promise<void>;
}

const UploadMsgFile: React.FC<
    AddMultipleLandlordsOrTenantsProps
> = ({ submitAction, accept, heading }) => {
    const [requestLoading, setRequestLoading] = useState(false);
    const acceptedExtensions = ["jpg", "jpeg", "png", "pdf", "mp3"];
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

    return (
        <>
            <div
                className="max-w-[570px] mx-auto mb-3 md:mb-4 lg:mb-12 border-4 border-dotted dark:border-darkText-2 py-8 md:py-12"
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
                               {heading ? heading : "Import File"} 
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
                // accept=".jpg, .jpeg, .png"
                accept={accept}
                onChange={handleFileChange}
            />
            <div className="flex justify-end gap-4 items-center">
                <Button
                    type="button"
                    onClick={handleSubmit}
                    size="base_medium"
                    className="py-2 px-8"
                    disabled={requestLoading}
                >
                    {requestLoading ? "Hang on..." : "Send"}
                </Button>
            </div>
        </>
    );
};

export default UploadMsgFile;
