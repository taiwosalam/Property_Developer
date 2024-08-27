// imports
import { SectionHeading } from "../Section/section-components";
import Button from "../Form/Button/button";
import { useState, useRef } from "react";
import Image from "next/image";
import UploadIcon from "/public/icons/upload-image.svg";

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        onChange(file); // Pass the file to the parent component
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select an image file.");
      onChange(null); // Clear the selection if not a valid image
    }
  };

  return (
    <div className="custom-flex-col gap-5">
      <SectionHeading required title="company logo">
        Ensure that your company logo has a white background, with a maximum
        size of 2MB. The picture must be between 250 to 600 pixels wide, or
        ideally 160px x 450px.
      </SectionHeading>
      <div className="flex gap-2">
        {image ? (
          <div className="w-[375px] h-[150px] relative rounded-xl p-6 bg-brand-1 flex items-center justify-center">
            <div>
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
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
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
