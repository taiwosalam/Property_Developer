// imports
import { SectionHeading } from "../Section/section-components";
import Button from "../Form/Button/button";
import { useState, useRef, useEffect, useContext } from "react";
import Image from "next/image";
import { FlowProgressContext } from "../FlowProgress/flow-progress";
import { DeleteIconOrange, UploadImageIcon } from "@/public/icons/icons";

interface CompanyLogoProps {
  hiddenInputClassName?: string;
}

const CompanyLogo: React.FC<CompanyLogoProps> = ({ hiddenInputClassName }) => {
  const { handleInputChange } = useContext(FlowProgressContext);
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      // Check image size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("The image size should not exceed 2 MB.");
        return;
      }

      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error resizing image:", error);
        alert("There was an error processing your image. Please try again.");
      }
    } else {
      alert("Please select a valid image file.");
    }
  };

  const handleDeleteImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  useEffect(() => {
    handleInputChange();
  }, [image, handleInputChange]);
  return (
    <div className="custom-flex-col gap-5">
      <SectionHeading required title="company logo">
        Ensure that your company logo has a white background, with a maximum
        size of 2MB. The picture must be between 250 to 600 pixels wide, or
        ideally 160px x 450px.
      </SectionHeading>
      <div className="flex gap-2">
        {/* input for flow progress */}
        <input
          type="hidden"
          className={hiddenInputClassName}
          value={image ? "filled" : ""}
        />
        <input
          name="company_logo"
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        {image ? (
          <div className="w-[375px] h-[150px] relative rounded-xl flex items-center justify-center">
            {/* Delete icon positioned at the top-right corner */}
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
                src={image}
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
        {image && (
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
