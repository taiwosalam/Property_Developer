import Image from "next/image";
import { useState, useRef, useEffect, useContext } from "react";
// Import
import { SectionHeading } from "../Section/section-components";
import Button from "../Form/Button/button";
import UploadIcon from "/public/icons/upload-image.svg";
import DeleteIcon from "@/public/icons/delete-icon-orange.svg";
import { FlowProgressContext } from "../FlowProgress/flow-progress";
interface ProfilePictureProps {
  hiddenInputClassName?: string;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  hiddenInputClassName,
}) => {
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
      <SectionHeading title="profile picture">
        The profile photo size should be 100 x 100 pixels with a maximum file
        size of 2MB.
      </SectionHeading>

      <div className="flex gap-2">
        {/* input for flow progress */}
        <input
          type="hidden"
          className={hiddenInputClassName}
          value={image ? "filled" : ""}
        />
        <input
          name="profile_pic"
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
                className="w-[40px] h-[40px]"
              />
            </button>
            <Image
              src={image}
              alt="Profile Picture"
              fill
              style={{ objectFit: "cover" }}
              className="rounded-lg w-[100px] h-[100px]"
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
              className="w-[25px] h-[25px] mb-2"
            />
            <span className="text-text-secondary text-xs md:text-sm font-normal">
              Upload Profile Picture
            </span>
          </button>
        )}
        {image && (
          <div className="flex items-end">
            <Button type="button" variant="change" size="sm" onClick={handleButtonClick}>
              Change Picture
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePicture;
