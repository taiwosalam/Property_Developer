// imports
import { SectionHeading } from "../Section/section-components";
import Button from "../Form/Button/button";
import { useContext } from "react";
import Image from "next/image";
import { FlowProgressContext } from "../FlowProgress/flow-progress";
import { DeleteIconOrange, UploadImageIcon } from "@/public/icons/icons";
import { useImageUploader } from "@/hooks/useImageUploader";

const CompanyLogo = () => {
  const { handleInputChange } = useContext(FlowProgressContext);
  const { preview, inputFileRef, handleImageChange, clearSelection } =
    useImageUploader({
      maxSize: { unit: "MB", value: 2 },
    });

  const handleButtonClick = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageChange(e);
    handleInputChange();
  };

  const handleDeleteImage = () => {
    clearSelection();
    handleInputChange();
  };

  return (
    <div className="company-logo-wrapper custom-flex-col gap-5">
      <SectionHeading required title="Upload company logo">
        Ensure that your company logo has a white background, with a maximum
        size of 2MB. The picture must be between 250 to 600 pixels wide, or
        ideally 160px x 450px.
      </SectionHeading>
      <div className="flex gap-2">
        <input
          name="company_logo"
          type="file"
          accept="image/*"
          ref={inputFileRef}
          onChange={handleFileChange}
          className="hidden setup-f required"
        />
        {preview ? (
          <div className="max-w-[375px] h-[150px] relative rounded-xl flex items-center justify-center">
            <button
              type="button"
              onClick={handleDeleteImage}
              className="absolute top-[-15px] right-[-25px] z-10"
              aria-label="Delete"
            >
              <DeleteIconOrange />
            </button>
            <div className="relative w-full h-full rounded-md overflow-hidden">
              <Image
                src={preview}
                alt="Company Logo"
                fill
                style={{ objectFit: "contain" }}
                className="rounded-md w-[375px] h-[150px] object-contain"
              />
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleButtonClick}
            className="w-[375px] h-[150px] rounded-xl border-2 border-dashed border-borders-normal flex flex-col items-center justify-center cursor-pointer"
          >
            <UploadImageIcon />
            <span className="text-text-secondary text-sm font-normal mt-2">
              Upload logo here
            </span>
          </button>
        )}
        {preview && (
          <div className="flex items-end">
            <Button variant="change" size="sm" onClick={handleButtonClick}>
              Change logo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyLogo;
