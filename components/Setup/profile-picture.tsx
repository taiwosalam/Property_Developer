import Image from "next/image";
import { useState, useRef } from "react";
// Import
import { SectionHeading } from "../Section/section-components";
import Button from "../Form/Button/button";
import UploadIcon from "/public/icons/upload-image.svg";

interface ProfilePictureProps {
  onChange: (file: File | null) => void; // onChange prop to pass file to parent
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ onChange }) => {
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
        onChange(file); 
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select an image file.");
      onChange(null); 
    }
  };

  return (
    <div className="custom-flex-col gap-5">
      <SectionHeading required title="profile picture">
        The profile photo size should be 180 x 180 pixels with a maximum file
        size of 2MB.
      </SectionHeading>

      <div className="flex gap-2">
        {image ? (
          <div className="w-[100px] h-[100px] relative rounded-lg">
            <Image
              src={image}
              width={100}
              height={100}
              alt="Company Logo"
              layout="fill"
              objectFit="cover"
              // className="rounded-lg"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={handleButtonClick}
            className="w-[100px] h-[100px] bg-[#D9D9D9] rounded-lg border border-solid border-neutral-4 flex items-center justify-center cursor-pointer"
          >
            <Image
              src={UploadIcon}
              alt="Upload Icon"
              width={40}
              height={40}
              className="mb-2"
            />
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

export default ProfilePicture;
