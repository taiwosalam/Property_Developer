// imports
import { SectionHeading } from "../Section/section-components";
import Button from "../Form/Button/button";
import { useState, useRef } from "react";
import Image from "next/image";
import UploadIcon from "@/public/icons/upload-image.svg";
import DeleteIcon from "@/public/icons/delete-icon-orange.svg";

interface CompanyLogoProps {
  onChange: (file: File | null) => void;
}

const CompanyLogo: React.FC<CompanyLogoProps> = ({ onChange }) => {
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
      // Check image size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("The image size should not exceed 5 MB.");
        onChange(null); // Clear the file if validation fails
        return;
      }

      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result as string);
          onChange(file); // Pass the compressed file to the parent component
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error resizing image:", error);
        alert("There was an error processing your image. Please try again.");
      }
    } else {
      alert("Please select a valid image file.");
      onChange(null); // Clear the file if invalid
    }
  };

  const handleDeleteImage = () => {
    setImage(null);
    onChange(null); // Clear the file when the delete icon is clicked
  };

  return (
    <div className="custom-flex-col gap-5">
      <SectionHeading required title="company logo">
        Ensure that your company logo has a white background, with a maximum
        size of 5MB. The picture must be between 250 to 600 pixels wide, or
        ideally 160px x 450px.
      </SectionHeading>
      <div className="flex gap-2">
        <input
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
              <Image
                src={DeleteIcon}
                alt="Delete Icon"
                width={40}
                height={40}
              />
            </button>
            <div className="relative w-full h-full rounded-md overflow-hidden">
              <Image
                src={image}
                alt="Company Logo"
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleButtonClick}
            className="w-[274px] h-[150px] rounded-xl border-2 border-dashed border-borders-normal flex flex-col items-center justify-center cursor-pointer"
          >
            <Image
              src={UploadIcon}
              alt="Upload Icon"
              width={40}
              height={40}
              className="mb-2"
            />
            <span className="text-text-secondary text-sm font-normal">
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
