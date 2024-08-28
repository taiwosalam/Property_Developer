import Image from "next/image";
import { useState, useRef } from "react";
// Import
import { SectionHeading } from "../Section/section-components";
import Button from "../Form/Button/button";
import UploadIcon from "/public/icons/upload-image.svg";
import DeleteIcon from "@/public/icons/delete-icon-orange.svg";

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
      <SectionHeading required title="profile picture">
        The profile photo size should be 100 x 100 pixels with a maximum file
        size of 5MB.
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
          <div className="w-[100px] h-[100px] relative">
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
            <Image
              src={image}
              alt="Profile Picture"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={handleButtonClick}
            className="w-[100px] h-[100px] rounded-xl border-2 border-dashed border-borders-normal flex flex-col items-center justify-center cursor-pointer"
          >
            <Image
              src={UploadIcon}
              alt="Upload Icon"
              width={25}
              height={25}
              className="mb-2"
            />
            <span className="text-text-secondary text-[8.8px] font-normal">
              Upload Profile Picture
            </span>
          </button>
        )}
        {image && (
          <div className="flex items-end">
            <Button variant="change" size="sm" onClick={handleButtonClick}>
              Change Picture
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePicture;
